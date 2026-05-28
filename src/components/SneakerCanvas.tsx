import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html, useProgress, Center, Lightformer } from '@react-three/drei'
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
            alt="Premium Quality Detail Fallback"
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
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebGLAvailable(false);
    }
  }, []);

  React.useEffect(() => {
    if (isVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible]);

  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { rootMargin: '500px 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!webGLAvailable) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={qualitySneaker}
          alt="Premium Quality Detail Fallback"
          className="w-full mix-blend-multiply drop-shadow-2xl saturate-[0.8] rounded-3xl"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div ref={wrapperRef} className="w-full h-[400px] lg:h-[600px] cursor-grab active:cursor-grabbing">
        <Canvas
          frameloop={isVisible ? 'always' : 'demand'}
          dpr={[1, Math.min(1.5, window.devicePixelRatio)]}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          performance={{ min: 0.5 }}
          onError={(e: any) => console.error("Canvas onError:", e)}
          camera={{ position: [0, 0, 20], fov: 50 }}
        >

          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          
          <Suspense fallback={<Loader />}>
            {hasBeenVisible && (
              <>
                <Center scale={0.8}>
                  <SneakerModel />
                </Center>
                <ContactShadows
                  position={[0, -2.5, 0]}
                  opacity={0.4}
                  scale={30}
                  blur={2}
                  far={10}
                />
                <Environment resolution={256}>
                  {/* Key light: panel grande arriba */}
                  <Lightformer
                    intensity={2}
                    position={[0, 5, 2]}
                    scale={[10, 5, 1]}
                    target={[0, 0, 0]}
                  />
                  {/* Relleno frontal suave */}
                  <Lightformer
                    intensity={1}
                    position={[0, 0, 6]}
                    scale={[10, 10, 1]}
                    color="#ffffff"
                  />
                  {/* Borde lateral derecho (define el contorno) */}
                  <Lightformer
                    form="rect"
                    intensity={1.5}
                    position={[6, 2, 1]}
                    scale={[1, 6, 1]}
                    color="#dfe7ff"
                  />
                  {/* Borde lateral izquierdo */}
                  <Lightformer
                    form="rect"
                    intensity={1.2}
                    position={[-6, 2, 1]}
                    scale={[1, 6, 1]}
                    color="#fff4e6"
                  />
                </Environment>
              </>
            )}
          </Suspense>

          {hasBeenVisible && (
            <OrbitControls 
              enableZoom={false} 
              minPolarAngle={Math.PI / 2.5} 
              maxPolarAngle={Math.PI / 1.5} 
              makeDefault
            />
          )}
        </Canvas>
      </div>
    </ErrorBoundary>
  )
}

