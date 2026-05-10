import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'

export default function SneakerModel({ color = '#ffffff' }: { color?: string }) {
  const group = useRef<THREE.Group>(null)
  
  // Revertimos al modelo OBJ original para asegurar visibilidad
  const obj = useLoader(OBJLoader, '/models/sneaker/Womens_Sneakers_7.obj')

  // Material único para toda la zapatilla, optimizado para performance
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.6,
      metalness: 0.1,
    });
  }, []);

  useMemo(() => {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
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

  return (
    <group ref={group} dispose={null}>
      <primitive object={obj} />
    </group>
  )
}

