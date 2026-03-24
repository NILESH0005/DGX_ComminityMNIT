"use client";
import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// 🔹 Crown Model (Centered + Optimized)
function CrownModel() {
  const { scene } = useGLTF("/Model/crown.glb");

  // ✅ Center model safely (no re-render crash)
  const centeredScene = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    return scene;
  }, [scene]);

  return (
    <primitive
      object={centeredScene}
      scale={0.6}   // 👈 Adjust size here
    />
  );
}

// 🔹 Main Component
const BadgeCompletion3D = ({ userId }) => {
  return (
    <div className="flex flex-col items-center mb-4">
      
      {/* 3D Canvas */}
      <div className="w-full h-[180px]">
        <Canvas
          key="crown-canvas"
          camera={{ position: [0, 0, 6], fov: 50 }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />

          {/* Model */}
          <Suspense fallback={null}>
            <CrownModel />
          </Suspense>

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      {/* Text */}
      <p className="mt-2 text-sm font-semibold text-yellow-600">
        👑 Your Achievements
      </p>
    </div>
  );
};

export default BadgeCompletion3D;