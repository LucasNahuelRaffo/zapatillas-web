import { useRef, useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SneakerModel() {
  const group = useRef<THREE.Group>(null)
  
  // Cargar GLB optimizado
  const { scene } = useGLTF('/models/sneaker/Womens_Sneakers_7.glb')

  // Cargar texturas originales desde la carpeta public explícitamente para evitar problemas de obj2gltf
  const props = useTexture({
    map: '/models/sneaker/textures/Womens_Sneakers_7_Diffuse.png',
    normalMap: '/models/sneaker/textures/Womens_Sneakers_7_Normal.png',
  })

  useEffect(() => {
    // Aplicar las texturas
    if (props.map) {
      props.map.colorSpace = THREE.SRGBColorSpace;
      props.map.flipY = false;
    }
    if (props.normalMap) {
      props.normalMap.flipY = false;
    }

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (material) {
          // Asignar texturas directamente
          material.map = props.map
          material.normalMap = props.normalMap
          material.color = new THREE.Color(0xffffff)
          material.roughness = 0.5
          material.metalness = 0.1
          material.needsUpdate = true
        }
      }
    })
  }, [scene, props])

  // Animación de flotado suave
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime()
      group.current.position.y = Math.sin(t / 1.5) / 10
      group.current.rotation.y = Math.sin(t / 2) / 8
      group.current.rotation.z = Math.cos(t / 4) / 10
    }
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

// Pre-cargar el modelo
useGLTF.preload('/models/sneaker/Womens_Sneakers_7.glb')
useTexture.preload('/models/sneaker/textures/Womens_Sneakers_7_Diffuse.png')
useTexture.preload('/models/sneaker/textures/Womens_Sneakers_7_Normal.png')
