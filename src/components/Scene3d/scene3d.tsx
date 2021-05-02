import * as THREE from 'three'
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { Environment, OrbitControls } from "@react-three/drei";


const Scene3d: React.FC = (props) => {


    const {
        children
    } = props;

    const [cameraPos, setCameraPos] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 5));

    const upDate = () => {

    }


    const handleKeyDown = (ev: KeyboardEvent) => {
        const speed = 10;
        switch (ev.key) {
            case 'w':
                setCameraPos(new THREE.Vector3(0, 0, cameraPos.z + speed))
                console.log(cameraPos.z);
                break;
            case 'a':
                break;
            case 'd':
                break;
            case 's':
                break;
        }
    }

    useEffect(() => {
        console.log(1);
    }, [cameraPos])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        upDate()
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [])


    return (
        <Canvas
            camera={{ fov: 100, near: 0.1, far: 1000, position: cameraPos, /* updateProjectionMatrix: upDate  */}}
        >
            <ambientLight intensity={0.3} />
            <directionalLight color="white" position={[1, 1, 1]} />
            <Suspense fallback={null}>
                {children}
                <OrbitControls />
                <Environment
                    // preset='warehouse'  
                    background
                    files={['ev.jpg', 'ev.jpg', 'ev.jpg', 'ev.jpg', 'ev.jpg', 'ev.jpg']}
                    path='/test/'

                />
            </Suspense>

        </Canvas>
    )
}

export default Scene3d;