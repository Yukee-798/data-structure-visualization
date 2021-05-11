import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Box, Environment, OrbitControls, PerspectiveCamera, TransformControls } from "@react-three/drei";
import { useSpring } from '@react-spring/three';

const Scene3d: React.FC = (props) => {


    const {
        children
    } = props;

    const cameraRef = useRef<THREE.PerspectiveCamera>();

    // useEffect(() => {
    //     cameraRef.current?.lookAt(new THREE.Vector3(10, 10, 1))
    // })


    const [cameraPos, setCameraPos] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 5));

    // const upDate = () => {
    //     // console.log(123);
    //     // return new THREE.Camera()
    // }


    const handleKeyDown = (ev: KeyboardEvent) => {
        // const delta = new THREE.Clock(true).getDelta();
        const moveDistance = 1;
        switch (ev.key) {
            case 'w':
                setCameraPos((pre) => (new THREE.Vector3(pre.x, pre.y, pre.z - moveDistance)));
                break;
            case 'a':
                setCameraPos((pre) => (new THREE.Vector3(pre.x - moveDistance, pre.y, pre.z)));
                break;
            case 'd':
                setCameraPos((pre) => (new THREE.Vector3(pre.x + moveDistance, pre.y, pre.z)));
                break;
            case 's':
                setCameraPos((pre) => (new THREE.Vector3(pre.x, pre.y, pre.z + moveDistance)));

                break;
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [])



    return (
        <Canvas
            
        >
            <PerspectiveCamera
                // ref={cameraRef}
                makeDefault
                position={[0, 0, 16]}
            // position={cameraPos}
            // lookAt={(v) => {
            //     // v = cameraPos;
            //     // console.log(v);
            // }}

            />
            <ambientLight intensity={0.3} />
            <directionalLight color="white" position={[1, 1, 1]} />
            <Suspense fallback={null}>

                {/* <TransformControls> */}
                    {children}
                {/* </TransformControls> */}

                <OrbitControls
                    maxDistance={20}
                />
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