'use client';

import { useRef, Suspense, forwardRef, useImperativeHandle, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const GLB_URL = '/anatomy_model.glb?v=2'; // v2 = updated 28 Feb 2026 (12.9 MB)

const ZONE_COLOR = {
    default: '#22d3ee',
    cardiovascular: '#ef4444',
    renal: '#f97316',
    skeletal: '#60a5fa',
    neurological: '#a78bfa',
};

/* ── Animated model ── */
function AnatomyModel({ activeZone, autoRotate, controlsRef }) {
    const group = useRef();
    const { scene } = useGLTF(GLB_URL);

    useFrame((_, delta) => {
        if (group.current && autoRotate && activeZone === 'default') {
            group.current.rotation.y += delta * 0.18;
        }
    });

    const accentHex = ZONE_COLOR[activeZone] || ZONE_COLOR.default;
    scene.traverse(child => {
        if (child.isMesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(mat => {
                if (mat.emissive) {
                    mat.emissiveIntensity = activeZone === 'default' ? 0.02 : 0.08;
                    mat.emissive.set(accentHex);
                }
            });
        }
    });

    return (
        <group ref={group} position={[0, -1.0, 0]} scale={1.15}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload(GLB_URL);

function Fallback() {
    return (
        <mesh>
            <capsuleGeometry args={[0.4, 1.6, 6, 16]} />
            <meshStandardMaterial color="#22d3ee" wireframe opacity={0.25} transparent />
        </mesh>
    );
}

/* ── Inner scene (needs access to camera for zoom ops) ── */
function Scene({ activeZone, autoRotate, orbitRef }) {
    return (
        <>
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 8, 4]} intensity={1.3} color="#ffffff" />
            <directionalLight position={[-4, 4, -4]} intensity={0.4} color="#a78bfa" />
            <pointLight position={[0, 5, 2]} intensity={0.7} color="#22d3ee" />

            <Suspense fallback={<Fallback />}>
                <AnatomyModel activeZone={activeZone} autoRotate={autoRotate} orbitRef={orbitRef} />
                <ContactShadows position={[0, -2, 0]} opacity={0.32} scale={3.5} blur={2.5} />
                <Environment preset="city" />
            </Suspense>

            <OrbitControls
                ref={orbitRef}
                enablePan={false}
                minDistance={1.0}
                maxDistance={7}
                minPolarAngle={Math.PI * 0.05}
                maxPolarAngle={Math.PI * 0.95}
                autoRotate={false}
                enableDamping
                dampingFactor={0.07}
            />
        </>
    );
}

/* ── Exported canvas — forwardRef exposes imperative handles ── */
const GLBCanvas = forwardRef(function GLBCanvas({ activeZone = 'default' }, ref) {
    const orbitRef = useRef();
    const [autoRotate, setAutoRotate] = useState(true);

    /* Expose control functions to parent */
    useImperativeHandle(ref, () => ({
        zoomIn() {
            const c = orbitRef.current;
            if (!c) return;
            c.object.position.multiplyScalar(0.82);
            c.update();
        },
        zoomOut() {
            const c = orbitRef.current;
            if (!c) return;
            c.object.position.multiplyScalar(1.22);
            c.update();
        },
        resetView() {
            const c = orbitRef.current;
            if (!c) return;
            c.object.position.set(0, 0, 2.6);
            c.target.set(0, 0, 0);
            c.update();
        },
        toggleRotate() {
            setAutoRotate(p => !p);
            return autoRotate; // returns new value (old state before toggle)
        },
        getAutoRotate() {
            return autoRotate;
        },
        rotateLeft() {
            const c = orbitRef.current;
            if (!c) return;
            c.object.position.applyEuler(new THREE.Euler(0, -Math.PI / 8, 0));
            c.update();
        },
        rotateRight() {
            const c = orbitRef.current;
            if (!c) return;
            c.object.position.applyEuler(new THREE.Euler(0, Math.PI / 8, 0));
            c.update();
        },
    }), [autoRotate]);

    return (
        <Canvas
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 2.6], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
        >
            <Scene activeZone={activeZone} autoRotate={autoRotate} orbitRef={orbitRef} />
        </Canvas>
    );
});

export default GLBCanvas;
