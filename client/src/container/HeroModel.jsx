import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("3D Model Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          3D Assistant unavailable
        </div>
      );
    }

    return this.props.children;
  }
}

// function Model() {
//   const { scene } = useGLTF("/Model/Chatbot.glb");

//   return (
//     <primitive
//       object={scene}
//       scale={10}
//       position={[0, -1, 0]}
//     />
//   );
// }

const MODEL_URL = `${import.meta.env.VITE_API_BASEURL}Model/Chatbot.glb`;

function Model() {
  const { scene } = useGLTF(MODEL_URL);

  return <primitive object={scene} scale={10} position={[0, -1, 0]} />;
}

export default function HeroModel() {
  return (
    <div className="flex justify-center items-center w-full h-[120px]">
      <ModelErrorBoundary>
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
          fallback={<div>3D rendering unavailable</div>}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.7} />

          <directionalLight position={[5, 5, 5]} intensity={1.2} />

          <Suspense fallback={null}>
            <Model />
          </Suspense>

          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}
