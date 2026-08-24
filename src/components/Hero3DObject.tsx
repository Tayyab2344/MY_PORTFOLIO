"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface Hero3DObjectProps {
  mousePos: React.RefObject<{ x: number; y: number }>;
  isReducedMotion?: boolean;
}

// 1. GLSL Shader for Outer Technical Shell - Deep Burgundy with Razor-Sharp Cream Rim
const FresnelShellShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorBase: { value: new THREE.Color("#7A1F2B") },     // Deep burgundy base
    uColorAccent: { value: new THREE.Color("#9C2B3A") },   // Lifted burgundy
    uColorRim: { value: new THREE.Color("#F5F1E8") },      // Warm cream edge highlight
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorBase;
    uniform vec3 uColorAccent;
    uniform vec3 uColorRim;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Calculate sharp Fresnel rim effect
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 4.0);
      
      // Dominant deep burgundy base with subtle facet color lift
      vec3 facetColor = mix(uColorBase, uColorAccent, 0.25);
      
      // Apply warm cream highlight strictly to extreme razor-sharp rim edges
      float rimWeight = clamp((fresnel - 0.6) * 2.5, 0.0, 1.0);
      vec3 finalColor = mix(facetColor, uColorRim, rimWeight);
      
      float alpha = 0.45 + fresnel * 0.45;
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

export default function Hero3DObject({ mousePos, isReducedMotion = false }: Hero3DObjectProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const outerMeshRef = useRef<THREE.Mesh>(null!);
  const strutsRef = useRef<THREE.LineSegments>(null!);
  const nodesInstancedRef = useRef<THREE.InstancedMesh>(null!);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null!);

  const { camera, raycaster, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const draggedNodeIndex = useRef<number | null>(null);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const dragIntersection = useRef(new THREE.Vector3());

  // --- A. Base Geometries & Physics Setup ---
  const coreGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.35, 1);
    const pos = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const factor = 1 + Math.sin(vertex.x * 2.5 + vertex.y * 1.8) * 0.07;
      vertex.multiplyScalar(factor);
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const baseOuterGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.1, 1);
    const pos = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const factor = 1 + Math.cos(vertex.y * 2.0 + vertex.z * 1.5) * 0.05;
      vertex.multiplyScalar(factor);
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Force-directed Physics State for Shell Vertices
  const physicsData = useMemo(() => {
    const posAttr = baseOuterGeometry.attributes.position;
    const count = posAttr.count;

    const restPositions: THREE.Vector3[] = [];
    const positions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];
    const forces: THREE.Vector3[] = [];

    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      v.fromBufferAttribute(posAttr, i);
      restPositions.push(v.clone());
      positions.push(v.clone());
      velocities.push(new THREE.Vector3(0, 0, 0));
      forces.push(new THREE.Vector3(0, 0, 0));
    }

    // Build spring connections based on vertex adjacency
    const connections: [number, number, number][] = [];
    const threshold = 1.8;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = restPositions[i].distanceTo(restPositions[j]);
        if (dist < threshold) {
          connections.push([i, j, dist]);
        }
      }
    }

    return { count, restPositions, positions, velocities, forces, connections };
  }, [baseOuterGeometry]);

  // Dynamic Struts Line Geometry connecting inner core to outer shell physics nodes
  const strutsGeometry = useMemo(() => {
    const corePos = coreGeometry.attributes.position;
    const count = Math.min(corePos.count, physicsData.count);
    const linePositions = new Float32Array(count * 6);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [coreGeometry, physicsData.count]);

  // Dynamic Outer Shell Mesh Geometry cloned from base
  const dynamicOuterGeometry = useMemo(() => {
    return baseOuterGeometry.clone();
  }, [baseOuterGeometry]);

  // --- B. Chaotic Lorenz Attractor Trail ---
  const attractorTrailData = useMemo(() => {
    const maxPoints = 260;
    const positions = new Float32Array(maxPoints * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Initial state for Lorenz differential equation
    const state = { x: 0.1, y: 0.0, z: 0.0 };
    const history: THREE.Vector3[] = [];
    
    return { maxPoints, positions, geo, state, history };
  }, []);

  const attractorLineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: "#9C2B3A",
      transparent: true,
      opacity: 0.35,
      linewidth: 1,
    });
    return new THREE.Line(attractorTrailData.geo, mat);
  }, [attractorTrailData.geo]);

  // Custom Shader Material instance
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(FresnelShellShader.uniforms),
      vertexShader: FresnelShellShader.vertexShader,
      fragmentShader: FresnelShellShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, []);

  // Initialize node matrices & colors
  useEffect(() => {
    if (!nodesInstancedRef.current) return;
    const dummy = new THREE.Object3D();
    const colorCream = new THREE.Color("#F5F1E8");
    const colorBurgundy = new THREE.Color("#9C2B3A");

    physicsData.positions.forEach((pos, idx) => {
      dummy.position.copy(pos);
      const scale = 0.04;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      nodesInstancedRef.current.setMatrixAt(idx, dummy.matrix);
      const color = idx % 2 === 0 ? colorCream : colorBurgundy;
      nodesInstancedRef.current.setColorAt(idx, color);
    });

    nodesInstancedRef.current.instanceMatrix.needsUpdate = true;
    if (nodesInstancedRef.current.instanceColor) {
      nodesInstancedRef.current.instanceColor.needsUpdate = true;
    }
  }, [physicsData]);

  // --- C. Interactive Drag Logic ---
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mouseVector = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouseVector, camera);

    // Find nearest node to click ray
    let minDist = Infinity;
    let closestIdx = 0;
    const tempWorldPos = new THREE.Vector3();

    physicsData.positions.forEach((pos, idx) => {
      if (groupRef.current) {
        tempWorldPos.copy(pos).applyMatrix4(groupRef.current.matrixWorld);
        const dist = raycaster.ray.distanceToPoint(tempWorldPos);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = idx;
        }
      }
    });

    draggedNodeIndex.current = closestIdx;
    setIsDragging(true);

    // Set drag plane parallel to camera at node location
    if (groupRef.current) {
      const nodeWorldPos = physicsData.positions[closestIdx].clone().applyMatrix4(groupRef.current.matrixWorld);
      dragPlane.current.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(), nodeWorldPos);
    }
  };

  const handlePointerMove = (e: MouseEvent) => {
    if (!isDragging || draggedNodeIndex.current === null || !groupRef.current) return;

    const mouseVector = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouseVector, camera);
    if (raycaster.ray.intersectPlane(dragPlane.current, dragIntersection.current)) {
      // Transform world intersection back to group local space
      const localTarget = dragIntersection.current.clone().applyMatrix4(groupRef.current.matrixWorld.clone().invert());
      physicsData.positions[draggedNodeIndex.current].copy(localTarget);
      physicsData.velocities[draggedNodeIndex.current].set(0, 0, 0);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    draggedNodeIndex.current = null;
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => handlePointerMove(e);
    const onUp = () => handlePointerUp();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  // Update cursor style when dragging
  useEffect(() => {
    gl.domElement.style.cursor = isDragging ? "grabbing" : "grab";
  }, [isDragging, gl]);

  // --- D. Per-Frame Physics, Shader & Attractor Updates ---
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Update Fresnel Shader Time Uniform
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = time;
    }

    // 2. Force-Directed Physics Simulation Engine
    const dt = Math.min(delta, 0.035);
    const kAnchor = 4.5;
    const kSpring = 2.5;
    const kRepulsion = 0.08;
    const damping = 0.86;

    const { count, restPositions, positions, velocities, forces, connections } = physicsData;

    // Reset forces
    for (let i = 0; i < count; i++) {
      forces[i].set(0, 0, 0);
      // Anchor force pulling node back to rest position
      forces[i].subVectors(restPositions[i], positions[i]).multiplyScalar(kAnchor);
    }

    // Edge Spring forces (Hooke's Law)
    connections.forEach(([i, j, restLen]) => {
      const p1 = positions[i];
      const p2 = positions[j];
      const diff = p2.clone().sub(p1);
      const currentLen = diff.length();
      if (currentLen > 0.001) {
        const deltaLen = currentLen - restLen;
        const forceMag = deltaLen * kSpring;
        const forceVec = diff.normalize().multiplyScalar(forceMag);
        forces[i].add(forceVec);
        forces[j].sub(forceVec);
      }
    });

    // Node Repulsion forces
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const diff = positions[i].clone().sub(positions[j]);
        const distSq = diff.lengthSq();
        if (distSq > 0.01 && distSq < 4.0) {
          const repelMag = kRepulsion / (distSq + 0.1);
          const repelVec = diff.normalize().multiplyScalar(repelMag);
          forces[i].add(repelVec);
          forces[j].sub(repelVec);
        }
      }
    }

    // Integrate Physics Velocity & Position (unless currently dragged)
    for (let i = 0; i < count; i++) {
      if (i === draggedNodeIndex.current && isDragging) continue;

      velocities[i].addScaledVector(forces[i], dt);
      velocities[i].multiplyScalar(damping);
      positions[i].addScaledVector(velocities[i], dt);
    }

    // Update dynamic mesh geometry buffer attribute
    const outerPosAttr = dynamicOuterGeometry.attributes.position;
    for (let i = 0; i < count; i++) {
      outerPosAttr.setXYZ(i, positions[i].x, positions[i].y, positions[i].z);
    }
    outerPosAttr.needsUpdate = true;
    dynamicOuterGeometry.computeVertexNormals();

    // Update connecting struts lines
    if (strutsRef.current) {
      const strutsPosAttr = strutsRef.current.geometry.attributes.position;
      const corePosAttr = coreGeometry.attributes.position;
      const strutCount = Math.min(corePosAttr.count, count);
      const vCore = new THREE.Vector3();

      for (let i = 0; i < strutCount; i++) {
        vCore.fromBufferAttribute(corePosAttr, i);
        const pOuter = positions[i];

        strutsPosAttr.setXYZ(i * 2, vCore.x, vCore.y, vCore.z);
        strutsPosAttr.setXYZ(i * 2 + 1, pOuter.x, pOuter.y, pOuter.z);
      }
      strutsPosAttr.needsUpdate = true;
    }

    // Update instanced node transforms & pulse
    if (nodesInstancedRef.current) {
      const dummy = new THREE.Object3D();
      positions.forEach((pos, idx) => {
        dummy.position.copy(pos);
        const pulse = isReducedMotion ? 1.0 : Math.sin(time * 2.5 + idx * 0.8) * 0.5 + 0.5;
        const baseScale = 0.034 + (idx % 3) * 0.008;
        const currentScale = baseScale * (0.85 + pulse * 0.35);

        dummy.scale.set(currentScale, currentScale, currentScale);
        dummy.updateMatrix();
        nodesInstancedRef.current.setMatrixAt(idx, dummy.matrix);
      });
      nodesInstancedRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Lorenz Chaotic Attractor Step Integration
    if (!isReducedMotion) {
      const { state, history, maxPoints, positions: attractorPosArr, geo: attractorGeo } = attractorTrailData;
      const sigma = 10.0;
      const rho = 28.0;
      const beta = 8.0 / 3.0;
      const lorenzDt = 0.006;

      // Execute 2 Lorenz steps per frame for smooth trajectory
      for (let k = 0; k < 2; k++) {
        const dx = sigma * (state.y - state.x) * lorenzDt;
        const dy = (state.x * (rho - state.z) - state.y) * lorenzDt;
        const dz = (state.x * state.y - beta * state.z) * lorenzDt;

        state.x += dx;
        state.y += dy;
        state.z += dz;

        // Scale and center Lorenz coordinates around core structure
        const scaledPt = new THREE.Vector3(
          state.x * 0.09,
          (state.y - 5.0) * 0.09,
          (state.z - 24.0) * 0.09
        );

        history.push(scaledPt);
        if (history.length > maxPoints) {
          history.shift();
        }
      }

      // Update attractor line geometry
      const lineAttr = attractorGeo.attributes.position;
      history.forEach((pt, i) => {
        lineAttr.setXYZ(i, pt.x, pt.y, pt.z);
      });
      lineAttr.needsUpdate = true;
      attractorGeo.setDrawRange(0, history.length);

      // 4. Base Idle Dual-Axis Rotation & Cursor Dampened Lerp
      const mouseX = (mousePos.current?.x || 0) * 0.45;
      const mouseY = (mousePos.current?.y || 0) * 0.35;

      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x += delta * 0.06;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        groupRef.current.rotation.y + mouseX * 0.03,
        0.06
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        groupRef.current.rotation.x - mouseY * 0.03,
        0.06
      );

      if (coreRef.current) {
        coreRef.current.rotation.y -= delta * 0.08;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} onPointerDown={handlePointerDown}>
      {/* Lighting Architecture: Warm Cream Rim + Deep Burgundy Fill */}
      <ambientLight intensity={0.4} color="#F5F1E8" />
      
      {/* Key directional light from top right */}
      <directionalLight
        position={[7, 9, 6]}
        intensity={2.8}
        color="#F5F1E8"
      />

      {/* Accent point light from bottom left */}
      <pointLight
        position={[-6, -5, -4]}
        intensity={2.2}
        color="#7A1F2B"
      />

      {/* Rim highlight point light */}
      <pointLight
        position={[4, 5, -5]}
        intensity={1.8}
        color="#9C2B3A"
      />

      {/* 1. Solid Faceted Inner Core with Clearcoat & Physical Roughness */}
      <mesh ref={coreRef} geometry={coreGeometry}>
        <meshPhysicalMaterial
          color="#7A1F2B"
          roughness={0.4}
          metalness={0.2}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          flatShading={true}
        />
      </mesh>

      {/* 2. Outer Faceted Shell with Deep Burgundy & Sharp Fresnel Rim Shader */}
      <mesh ref={outerMeshRef} geometry={dynamicOuterGeometry}>
        <primitive
          object={shaderMaterial}
          ref={shaderMaterialRef}
          attach="material"
        />
      </mesh>

      {/* 3. Structural Connecting Beams / Deformable Struts */}
      <lineSegments ref={strutsRef} geometry={strutsGeometry}>
        <lineBasicMaterial
          color="#F5F1E8"
          transparent={true}
          opacity={0.25}
          linewidth={1}
        />
      </lineSegments>

      {/* 4. Asynchronous Pulsing Emissive Instanced Physics Micro-Nodes */}
      <instancedMesh
        ref={nodesInstancedRef}
        args={[undefined, undefined, physicsData.count]}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          emissive="#F5F1E8"
          emissiveIntensity={0.65}
        />
      </instancedMesh>

      {/* 5. Chaotic Lorenz Attractor Ambient Wisp Particle Trail */}
      <primitive object={attractorLineObject} />
    </group>
  );
}
