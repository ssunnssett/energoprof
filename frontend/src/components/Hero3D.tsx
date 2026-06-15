import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, MeshDistortMaterial, ContactShadows, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const EnergyCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Outer Glass Shell */}
        <mesh ref={meshRef}>
          {/* Smooth massive sphere instead of icosahedron */}
          <sphereGeometry args={[1.8, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            thickness={3}
            roughness={0.05}
            transmission={1}
            ior={1.2}
            chromaticAberration={0.15}
            distortion={0.6}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color={theme === 'light' ? '#ffffff' : '#ecfdf5'}
          />
        </mesh>

        {/* Inner energy core (abstract wireframe) */}
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <MeshDistortMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={theme === 'light' ? 3 : 2}
            distort={0.6}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            wireframe={true}
          />
        </mesh>

        {/* Ball Lightning Sparks inside and around */}
        <Sparkles
          count={400}
          scale={3.5}
          size={3}
          speed={0.6}
          noise={0.8}
          color="#60a5fa"
        />
        <Sparkles
          count={200}
          scale={2.5}
          size={5}
          speed={1.0}
          noise={1.2}
          color="#fb923c"
        />
      </Float>
    </group>
  );
};

const Hero3D = () => {
  const { theme } = useTheme();

  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none md:pointer-events-auto">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={45} />

        <ambientLight intensity={theme === 'light' ? 1.5 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={theme === 'light' ? 4 : 2} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={theme === 'light' ? 4 : 2} color="#f97316" />
        
        {/* Дополнительный свет сзади для светлой темы, чтобы убрать черноту в стекле */}
        {theme === 'light' && (
          <pointLight position={[0, 0, -10]} intensity={8} color="#ffffff" />
        )}

        {/* Use a rich environment map for the glass refractions to look good */}
        <Environment preset="city" background={false} />

        {/* 
          ЗДЕСЬ ВЫ МОЖЕТЕ ДВИГАТЬ И МЕНЯТЬ РАЗМЕР СФЕРЫ:
          position={[x, y, z]} 
            x: вправо (+) или влево (-)
            y: вверх (+) или вниз (-)
            z: ближе (+) или дальше (-) от камеры
          scale={...} 
            увеличить или уменьшить всю сферу сразу
        */}
        <group position={[0, -7.4, 0]} scale={3.8}>
          <EnergyCore />
        </group>

        <ContactShadows
          position={[3.5, -4, 0]}
          opacity={theme === 'light' ? 0.2 : 0.6}
          scale={30}
          blur={2.5}
          far={10}
          color={theme === 'light' ? '#cbd5e1' : '#1e1e2d'}
        />
      </Canvas>
    </div>
  );
};

export default Hero3D;

