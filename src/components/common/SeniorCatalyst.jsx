import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Float,
    Text,
    MeshTransmissionMaterial,
    Environment,
    ScrollControls,
    useScroll,
    PerspectiveCamera,
    Stars,
    Float as DreiFloat,
    ContactShadows,
    Lightformer
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const Prism = ({ scale = 1, ...props }) => {
    const ref = useRef();
    const scroll = useScroll();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const offset = scroll.offset;

        if (ref.current) {
            ref.current.rotation.y = t * 0.2 + offset * 5;
            ref.current.rotation.z = t * 0.1;
            ref.current.position.y = Math.sin(t) * 0.5;
        }
    });

    return (
        <group {...props}>
            <mesh ref={ref} scale={scale}>
                <icosahedronGeometry args={[2, 0]} />
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    resolution={1024}
                    transmission={1}
                    roughness={0}
                    thickness={1}
                    ior={1.5}
                    chromaticAberration={0.06}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.1}
                    temporalDistortion={0.1}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#ffffff"
                    color="#3b82f6"
                />
            </mesh>

            {/* Inner Glowing Core */}
            <mesh scale={0.5}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#3b82f6"
                    emissive="#3b82f6"
                    emissiveIntensity={15}
                />
            </mesh>
        </group>
    );
};

const Content = () => {
    const scroll = useScroll();
    const { camera } = useThree();

    useFrame((state) => {
        const offset = scroll.offset;
        // Cinematic camera movement
        camera.position.z = 15 - offset * 20;
        camera.position.y = Math.sin(offset * Math.PI) * 2;
        camera.lookAt(0, 0, -offset * 10);
    });

    return (
        <group>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Prism position={[0, 0, 0]} scale={2} />

            {/* Background elements */}
            <DreiFloat speed={2} rotationIntensity={2} floatIntensity={2}>
                <mesh position={[-10, 5, -10]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial ior={1.2} thickness={0.5} chromaticAberration={0.1} color="#60a5fa" />
                </mesh>
            </DreiFloat>

            <DreiFloat speed={3} rotationIntensity={1} floatIntensity={3}>
                <mesh position={[10, -5, -20]}>
                    <icosahedronGeometry args={[1.5, 0]} />
                    <MeshTransmissionMaterial ior={1.3} thickness={1} chromaticAberration={0.2} color="#2563eb" />
                </mesh>
            </DreiFloat>

            {/* Senior Tags */}
            {[
                { t: "ARCHITECTURAL MASTERY", z: -5 },
                { t: "HIGH PERFORMANCE", z: -15 },
                { t: "SENIOR VISIONary", z: -25 }
            ].map((d, i) => (
                <Text
                    key={i}
                    position={[0, 5, d.z]}
                    fontSize={0.8}
                    color="white"
                    font="https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm4df9WRJhYzKMff1iw.woff"
                    textAlign="center"
                    letterSpacing={0.3}
                    opacity={0.1}
                >
                    {d.t}
                </Text>
            ))}

            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
        </group>
    );
};

const SeniorCatalyst = () => {
    return (
        <div className="h-[500vh] w-full relative bg-[#010103] overflow-hidden">
            <div className="sticky top-0 h-screen w-full">
                <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault fov={45} position={[0, 0, 15]} />
                    <color attach="background" args={["#010103"]} />
                    <fog attach="fog" args={["#010103", 5, 45]} />

                    <ScrollControls pages={5} damping={0.2}>
                        <Content />
                    </ScrollControls>

                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <spotLight position={[0, 20, 0]} intensity={2} angle={0.2} penumbra={1} castShadow />

                    <Environment preset="city">
                        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
                        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
                        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
                    </Environment>
                </Canvas>

                {/* UI Overlays */}
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <p className="text-primary font-mono tracking-[1rem] uppercase text-[10px] opacity-40">System Genesis v5.0</p>
                        <h2 className="text-[12rem] md:text-[20rem] font-black text-white/[0.03] uppercase tracking-tighter leading-none select-none">
                            LEO
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeniorCatalyst;
