import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import SneakerModel from './SneakerModel'
import qualitySneaker from '../img/quality_sneaker.png'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in 3D Sneaker Canvas:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <img
            src={qualitySneaker}
            alt="AAA Quality Detail Fallback"
            className="w-full mix-blend-multiply drop-shadow-2xl saturate-[0.8] rounded-3xl"
          />
        </div>
      )
    }

    return this.children
  }
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export default function SneakerCanvas() {
  const [webGLAvailable, setWebGLAvailable] = React.useState(true);

  React.useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebGLAvailable(false);
    }
  }, []);

  if (!webGLAvailable) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={qualitySneaker}
          alt="AAA Quality Detail Fallback"
          className="w-full mix-blend-multiply drop-shadow-2xl saturate-[0.8] rounded-3xl"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full h-[400px] lg:h-[600px] cursor-grab active:cursor-grabbing">
        <Canvas 
          shadows 
          dpr={[1, 2]}
          onError={(e) => console.error("Canvas onError:", e)}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <Suspense fallback={null}>
            <SneakerModel />
            <ContactShadows 
              position={[0, -1.5, 0]} 
              opacity={0.4} 
              scale={10} 
              blur={2} 
              far={4.5} 
            />
            <Environment preset="city" />
          </Suspense>

          <OrbitControls 
            enableZoom={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 1.5} 
          />
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
