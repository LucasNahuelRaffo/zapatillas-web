import { useRef, useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { useMemo } from 'react'

export default function SneakerModel({ color = '#ffffff' }: { color?: string }) {
  const group = useRef<THREE.Group>(null)
  
  // Cargar geometría original OBJ y texturas optimizadas (para evitar la memoria de VRAM del GLB)
  const obj = useLoader(OBJLoader, '/models/sneaker/Womens_Sneakers_7.obj')

  const props = useTexture({
    map: '/models/sneaker/textures/Womens_Sneakers_7_Diffuse.jpg',
    normalMap: '/models/sneaker/textures/Womens_Sneakers_7_Normal.jpg',
  })

  // Material único para toda la zapatilla
  const material = useMemo(() => {
    if (props.map) {
      props.map.colorSpace = THREE.SRGBColorSpace;
      props.map.flipY = false;
    }
    if (props.normalMap) {
      props.normalMap.flipY = false;
    }
    return new THREE.MeshStandardMaterial({
      map: props.map,
      normalMap: props.normalMap,
      color: new THREE.Color('#ffffff'), // Inicial
      roughness: 0.5,
      metalness: 0.1
    });
  }, [props.map, props.normalMap]);

  useEffect(() => {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = material;
      }
    })
  }, [obj, material])

  const targetColor = useMemo(() => new THREE.Color(color), [color]);

  // Animación de flotado suave
  useFrame((state, delta) => {
    if (group.current) {
      const t = state.clock.getElapsedTime()
      group.current.position.y = Math.sin(t / 1.5) / 10
      group.current.rotation.y = Math.sin(t / 2) / 8
      group.current.rotation.z = Math.cos(t / 4) / 10
    }
    
    // Transición suave de color
    material.color.lerp(targetColor, 5 * delta);
  })

  // Usar primitivo clonado o original
  return (
    <group ref={group} dispose={null}>
      <primitive object={obj} />
    </group>
  )
}

// Pre-cargar texturas
useTexture.preload('/models/sneaker/textures/Womens_Sneakers_7_Diffuse.jpg')
useTexture.preload('/models/sneaker/textures/Womens_Sneakers_7_Normal.jpg')
