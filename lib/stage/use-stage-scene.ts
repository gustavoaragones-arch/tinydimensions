"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import {
  getCameraPositionMm,
  getNearFarPlanesMm,
  STAGE_FOV_DEG,
} from "@/lib/stage/camera";
import {
  clampViewingDistanceMm,
  isBlockOutOfBounds,
  scaleBlock,
  type Scene,
  type SceneBlock,
  type ViewerState,
} from "@/lib/stage/scene";

const ROLE_COLOR: Record<SceneBlock["role"], number> = {
  primary: 0x2563eb,
  secondary: 0x9ca3af,
  terrain: 0x84744f,
};

const SELECTED_EMISSIVE = 0x1e293b;
const OUT_OF_BOUNDS_OPACITY = 0.45;
const IN_BOUNDS_OPACITY = 0.92;

/** Screen-space degrees of azimuth per pixel of horizontal drag. */
const ORBIT_SENSITIVITY_DEG_PER_PX = 0.3;
/** Scaled-scene mm of viewing distance per pixel/unit of wheel/pinch delta. */
const DOLLY_SENSITIVITY = 0.5;
/** Shift-snap increment, in scaled scene mm. */
const SNAP_MM = 5;

export type TransformMode = "translate" | "rotate";

export interface UseStageSceneOptions {
  scene: Scene;
  viewer: ViewerState;
  selectedBlockId: string | null;
  transformMode: TransformMode;
  onSelectBlock: (id: string | null) => void;
  onBlockTransform: (
    id: string,
    patch: { xMm?: number; zMm?: number; rotationDeg?: number },
  ) => void;
  onViewerChange: (patch: Partial<ViewerState>) => void;
}

export interface UseStageSceneResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  webglAvailable: boolean;
  /**
   * Renders one frame - at the given viewer state, or the live one - and returns a
   * PNG data URL. Restores the live camera position immediately afterward; since camera
   * position is always re-derived from `viewer` on the next effect run, this can never
   * leave the on-screen view in the overridden position.
   */
  captureSnapshot: (overrideViewer?: ViewerState) => string | null;
  getCanvasSize: () => { width: number; height: number } | null;
}

/**
 * showX/showY/showZ/showXY/showYZ/showXZ only filter handles within the *currently
 * active* mode's gizmo group (translate vs rotate render separate, mutually exclusive
 * handle sets) - so these must be re-applied every time the mode changes, not set once.
 * Translate: X/Z arrows plus the XZ ground-plane handle only, never Y.
 * Rotate: the Y ring only, never X/Z or the free-rotate (XYZE) ring.
 */
function applyTransformModeConstraints(controls: TransformControls, mode: TransformMode): void {
  if (mode === "translate") {
    controls.showX = true;
    controls.showZ = true;
    controls.showXZ = true;
    controls.showY = false;
    controls.showXY = false;
    controls.showYZ = false;
  } else {
    controls.showY = true;
    controls.showX = false;
    controls.showZ = false;
    controls.showXY = false;
    controls.showYZ = false;
    controls.showXZ = false;
  }
}

/** Synchronous probe using a throwaway canvas - no container/renderer needed yet. */
function detectWebglSupport(): boolean {
  if (typeof document === "undefined") return true; // SSR: resolved for real on client mount
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

export function useStageScene(options: UseStageSceneOptions): UseStageSceneResult {
  const containerRef = useRef<HTMLDivElement>(null);
  // Lazy initializer: computed once during the first render, not as a setState-in-effect.
  const [webglAvailable] = useState(detectWebglSupport);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneObjRef = useRef<THREE.Scene | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const blockMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const basePlaneRef = useRef<THREE.Mesh | null>(null);
  const isTransformDraggingRef = useRef(false);
  const isOrbitDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const rafRef = useRef(0);

  // ---------------------------------------------------------------------
  // One-time setup: renderer, scene, camera, lights, base, controls, listeners.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // container is only ever mounted when the lazy webglAvailable probe passed (see
    // StageViewport), so a failure here is the rarer case of the probe succeeding but
    // real renderer construction still failing - logged, not surfaced as UI state.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    } catch (error) {
      console.error("Stage: WebGL renderer failed to initialize", error);
      return;
    }
    if (!renderer.getContext()) {
      console.error("Stage: WebGL context unavailable after renderer construction");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f4);
    sceneObjRef.current = scene;

    const initialExtent = Math.max(
      optionsRef.current.scene.baseWidthMm,
      optionsRef.current.scene.baseDepthMm,
      optionsRef.current.viewer.viewingDistanceMm,
    );
    const initialPlanes = getNearFarPlanesMm(initialExtent);
    const camera = new THREE.PerspectiveCamera(
      STAGE_FOV_DEG,
      width / height,
      initialPlanes.near,
      initialPlanes.far,
    );
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 2, 1);
    scene.add(dirLight);

    const basePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshStandardMaterial({ color: 0xe7e5e4, side: THREE.DoubleSide }),
    );
    basePlane.rotation.x = -Math.PI / 2;
    basePlane.position.y = 0;
    scene.add(basePlane);
    basePlaneRef.current = basePlane;

    const grid = new THREE.GridHelper(1, 10, 0xd6d3d1, 0xd6d3d1);
    grid.name = "__grid";
    scene.add(grid);

    const transformControls = new TransformControls(camera, renderer.domElement);
    applyTransformModeConstraints(transformControls, optionsRef.current.transformMode);
    transformControls.setMode(optionsRef.current.transformMode);
    // TransformControls (r169+) is not itself an Object3D; getHelper() returns the
    // renderable root that must be added to the scene.
    scene.add(transformControls.getHelper());
    transformControlsRef.current = transformControls;

    transformControls.addEventListener("dragging-changed", (event) => {
      isTransformDraggingRef.current = Boolean((event as { value: boolean }).value);
    });

    transformControls.addEventListener("objectChange", () => {
      const mesh = transformControls.object as THREE.Mesh | undefined;
      if (!mesh) return;
      // Blocks sit on the base: Y translation is never persisted regardless of gizmo behaviour.
      mesh.position.y = mesh.userData.baseY as number;
    });

    transformControls.addEventListener("mouseUp", () => {
      const mesh = transformControls.object as THREE.Mesh | undefined;
      if (!mesh) return;
      const id = mesh.userData.blockId as string;
      if (optionsRef.current.transformMode === "translate") {
        // Position is already in scaled millimetres - the mesh's Three.js units - so
        // it's written straight through, unlike widthMm/depthMm/heightMm which are real.
        optionsRef.current.onBlockTransform(id, {
          xMm: mesh.position.x,
          zMm: mesh.position.z,
        });
      } else {
        const deg = THREE.MathUtils.radToDeg(mesh.rotation.y);
        const normalized = ((deg % 360) + 360) % 360;
        optionsRef.current.onBlockTransform(id, { rotationDeg: normalized });
      }
    });

    const raycaster = new THREE.Raycaster();

    function ndcFromEvent(event: PointerEvent): THREE.Vector2 {
      const rect = renderer.domElement.getBoundingClientRect();
      return new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
    }

    function handlePointerDown(event: PointerEvent) {
      if (isTransformDraggingRef.current) return;
      const ndc = ndcFromEvent(event);
      raycaster.setFromCamera(ndc, camera);
      const meshes = [...blockMeshesRef.current.values()];
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0) {
        const id = hits[0].object.userData.blockId as string;
        optionsRef.current.onSelectBlock(id);
        return;
      }
      optionsRef.current.onSelectBlock(null);
      isOrbitDraggingRef.current = true;
      lastPointerXRef.current = event.clientX;
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isOrbitDraggingRef.current || isTransformDraggingRef.current) return;
      const deltaPx = event.clientX - lastPointerXRef.current;
      lastPointerXRef.current = event.clientX;
      const current = optionsRef.current.viewer.azimuthDeg;
      const next = ((current + deltaPx * ORBIT_SENSITIVITY_DEG_PER_PX) % 360 + 360) % 360;
      optionsRef.current.onViewerChange({ azimuthDeg: next });
    }

    function handlePointerUp() {
      isOrbitDraggingRef.current = false;
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const current = optionsRef.current.viewer.viewingDistanceMm;
      const next = clampViewingDistanceMm(current + event.deltaY * DOLLY_SENSITIVITY);
      optionsRef.current.onViewerChange({ viewingDistanceMm: next });
    }

    let pinchStartDistance: number | null = null;
    let pinchStartViewingDistance = 0;

    function touchDistance(touches: TouchList): number {
      const [a, b] = [touches[0], touches[1]];
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length === 2) {
        pinchStartDistance = touchDistance(event.touches);
        pinchStartViewingDistance = optionsRef.current.viewer.viewingDistanceMm;
        isOrbitDraggingRef.current = false;
      }
    }

    function handleTouchMove(event: TouchEvent) {
      if (event.touches.length === 2 && pinchStartDistance !== null) {
        event.preventDefault();
        const currentDistance = touchDistance(event.touches);
        const scale = pinchStartDistance / Math.max(currentDistance, 1);
        const next = clampViewingDistanceMm(pinchStartViewingDistance * scale);
        optionsRef.current.onViewerChange({ viewingDistanceMm: next });
      }
    }

    function handleTouchEnd(event: TouchEvent) {
      if (event.touches.length < 2) {
        pinchStartDistance = null;
      }
    }

    const dom = renderer.domElement;
    dom.style.touchAction = "none";
    dom.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    dom.addEventListener("wheel", handleWheel, { passive: false });
    dom.addEventListener("touchstart", handleTouchStart, { passive: true });
    dom.addEventListener("touchmove", handleTouchMove, { passive: false });
    dom.addEventListener("touchend", handleTouchEnd);

    function renderLoop() {
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(renderLoop);
    }
    renderLoop();

    const resizeObserver = new ResizeObserver(() => {
      const c = containerRef.current;
      if (!c) return;
      const w = c.clientWidth || 1;
      const h = c.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      dom.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      dom.removeEventListener("wheel", handleWheel);
      dom.removeEventListener("touchstart", handleTouchStart);
      dom.removeEventListener("touchmove", handleTouchMove);
      dom.removeEventListener("touchend", handleTouchEnd);
      transformControls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ---------------------------------------------------------------------
  // Sync block meshes whenever blocks or ratio change.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const sceneObj = sceneObjRef.current;
    if (!sceneObj) return;
    const meshes = blockMeshesRef.current;
    const seen = new Set<string>();

    for (const block of options.scene.blocks) {
      seen.add(block.id);
      const scaled = scaleBlock(block, options.scene.ratio);
      let mesh = meshes.get(block.id);
      if (!mesh) {
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({ color: ROLE_COLOR[block.role], transparent: true }),
        );
        mesh.userData.blockId = block.id;
        sceneObj.add(mesh);
        meshes.set(block.id, mesh);
      }
      mesh.scale.set(
        Math.max(scaled.widthMm, 0.001),
        Math.max(scaled.heightMm, 0.001),
        Math.max(scaled.depthMm, 0.001),
      );
      const baseY = scaled.heightMm / 2;
      mesh.position.set(scaled.xMm, baseY, scaled.zMm);
      mesh.rotation.y = THREE.MathUtils.degToRad(block.rotationDeg);
      mesh.userData.baseY = baseY;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.color.setHex(ROLE_COLOR[block.role]);
      const outOfBounds = isBlockOutOfBounds(scaled, options.scene);
      material.opacity = outOfBounds ? OUT_OF_BOUNDS_OPACITY : IN_BOUNDS_OPACITY;
      const isSelected = options.selectedBlockId === block.id;
      material.emissive = new THREE.Color(isSelected ? SELECTED_EMISSIVE : 0x000000);
    }

    for (const [id, mesh] of meshes) {
      if (!seen.has(id)) {
        sceneObj.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
        meshes.delete(id);
      }
    }
  }, [options.scene, options.selectedBlockId]);

  // ---------------------------------------------------------------------
  // Base plane + grid sizing.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const basePlane = basePlaneRef.current;
    const sceneObj = sceneObjRef.current;
    if (!basePlane || !sceneObj) return;
    basePlane.scale.set(options.scene.baseWidthMm, options.scene.baseDepthMm, 1);
    const grid = sceneObj.getObjectByName("__grid") as THREE.GridHelper | undefined;
    if (grid) {
      sceneObj.remove(grid);
      grid.geometry.dispose();
      const material = Array.isArray(grid.material) ? grid.material : [grid.material];
      for (const m of material) m.dispose();
    }
    const extent = Math.max(options.scene.baseWidthMm, options.scene.baseDepthMm);
    const newGrid = new THREE.GridHelper(extent, 10, 0xd6d3d1, 0xd6d3d1);
    newGrid.name = "__grid";
    newGrid.position.y = 0.001;
    sceneObj.add(newGrid);
  }, [options.scene.baseWidthMm, options.scene.baseDepthMm]);

  // ---------------------------------------------------------------------
  // Camera position + clip planes from viewer state (authoritative each frame).
  // ---------------------------------------------------------------------
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    const pos = getCameraPositionMm(options.viewer);
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(0, 0, 0);
    const extent = Math.max(
      options.scene.baseWidthMm,
      options.scene.baseDepthMm,
      options.viewer.viewingDistanceMm,
    );
    const { near, far } = getNearFarPlanesMm(extent);
    camera.near = near;
    camera.far = far;
    camera.updateProjectionMatrix();
  }, [options.viewer, options.scene.baseWidthMm, options.scene.baseDepthMm]);

  // ---------------------------------------------------------------------
  // Attach/detach TransformControls to the selected block; keep mode in sync.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const controls = transformControlsRef.current;
    if (!controls) return;
    controls.setMode(options.transformMode);
    applyTransformModeConstraints(controls, options.transformMode);
    if (options.selectedBlockId) {
      const mesh = blockMeshesRef.current.get(options.selectedBlockId);
      if (mesh) {
        controls.attach(mesh);
        return;
      }
    }
    controls.detach();
  }, [options.selectedBlockId, options.transformMode]);

  // ---------------------------------------------------------------------
  // Shift-snap: intercept objectChange while Shift is held.
  // ---------------------------------------------------------------------
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Shift") {
        const controls = transformControlsRef.current;
        if (controls) controls.setTranslationSnap(SNAP_MM);
      }
    }
    function onKeyUp(event: KeyboardEvent) {
      if (event.key === "Shift") {
        const controls = transformControlsRef.current;
        if (controls) controls.setTranslationSnap(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function captureSnapshot(overrideViewer?: ViewerState): string | null {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const sceneObj = sceneObjRef.current;
    if (!renderer || !camera || !sceneObj) return null;

    const viewerForCapture = overrideViewer ?? optionsRef.current.viewer;
    const pos = getCameraPositionMm(viewerForCapture);
    const savedPosition = camera.position.clone();

    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(0, 0, 0);
    renderer.render(sceneObj, camera);
    const dataUrl = renderer.domElement.toDataURL("image/png");

    // Restore the live camera immediately - synchronous, so no frame is ever painted
    // with the overridden position.
    camera.position.copy(savedPosition);
    camera.lookAt(0, 0, 0);
    renderer.render(sceneObj, camera);

    return dataUrl;
  }

  function getCanvasSize(): { width: number; height: number } | null {
    const dom = rendererRef.current?.domElement;
    return dom ? { width: dom.width, height: dom.height } : null;
  }

  return { containerRef, webglAvailable, captureSnapshot, getCanvasSize };
}
