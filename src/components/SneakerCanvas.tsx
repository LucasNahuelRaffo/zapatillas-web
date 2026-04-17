import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html, useProgress, Center } from '@react-three/drei'
import SneakerModel from './SneakerModel'
import qualitySneaker from '../img/quality_sneaker.png'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-black font-skylight text-2xl tracking-tighter w-48 text-center flex flex-col items-center">
        {progress.toFixed(0)}%
        <span className="text-xs uppercase tracking-widest text-gray-400 mt-2 block">Cargando 3D</span>
      </div>
    </Html>
  )
}

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

    return this.props.children
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
          camera={{ position: [0, 0, 20], fov: 50 }}
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <Suspense fallback={<Loader />}>
            <Center scale={0.2}>
              <SneakerModel />
            </Center>
            <ContactShadows 
              position={[0, -2, 0]} 
              opacity={0.4} 
              scale={20} 
              blur={2} 
              far={10} 
            />
            <Environment preset="city" />
          </Suspense>

          <OrbitControls 
            enableZoom={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 1.5} 
            makeDefault
          />
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}
