import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SneakerModel() {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/sneaker/Womens_Sneakers_7.gltf')

  // Animación de flotado suave (auto-float)
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime()
      group.current.position.y = Math.sin(t / 1.5) / 10
      group.current.rotation.y = Math.sin(t / 2) / 8
      group.current.rotation.z = Math.cos(t / 4) / 10
    }
  })

  return (
    <group ref={group} dispose={null} scale={12}>
      <primitive object={scene} />
    </group>
  )
}

// Pre-cargar el modelo
useGLTF.preload('/models/sneaker/Womens_Sneakers_7.gltf')
