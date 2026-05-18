import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function SneakerModel() {
  const group = useRef<THREE.Group>(null)
  
  // Cargamos el nuevo modelo GLB de Adidas
  const { scene } = useGLTF('/models/sneaker/adidas.glb')

  // Configuración de sombras optimizada para el nuevo modelo usando useMemo
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Animación de flotado suave con offset vertical para subir el modelo
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime()
      group.current.position.y = 0.2 + Math.sin(t / 1.5) / 10
      group.current.rotation.y = Math.sin(t / 2) / 8
      group.current.rotation.z = Math.cos(t / 4) / 10
    }
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={4.5} />
    </group>
  )
}
