import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/sneaker/adidas-draco.glb', true)

export default function SneakerModel() {
  const group = useRef<THREE.Group>(null)
  
  const { scene } = useGLTF('/models/sneaker/adidas-draco.glb', true)

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

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
