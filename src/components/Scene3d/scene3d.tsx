import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Environment, OrbitControls, PerspectiveCamera, Reflector, TransformControls } from "@react-three/drei";
import './scene3d.scss'

const Scene3d: React.FC = (props) => {
    const {
        children
    } = props;

    const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

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
                // setCameraPos((pre) => (new THREE.Vector3(pre.x, pre.y, pre.z - moveDistance)));
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



    // useEffect(() => {
    //     if (cameraRef.current) {
    //         cameraRef.current.lookAt(new THREE.Vector3(0, -10, 16))
    //     }
    //     // console.log(cameraRef.current);
    //     // cameraRef.current?.lookAt(new THREE.Vector3(0, -10, 16))
    // })
    return (
        <div className='scene3d-warp'>
            <Canvas>
                <PerspectiveCamera
                    ref={cameraRef}
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
                    {/** <Reflector
                    resolution={1024}
                    args={[10, 10]}
                    mirror={0.75}
                    // mixBlur={mixBlur || 0}
                    mixStrength={1}
                    rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                    minDepthThreshold={0.8}
                    maxDepthThreshold={1.2}
                    // depthScale={depthScale || 0}
                    depthToBlurRatioBias={0.2}
                    debug={0}
                    // distortion={distortion || 0}
                    // distortionMap={distortionMap}
                >
                    
                    {(Material, props) => (
                        <Material
                            color="#ddd"
                            metalness={0}
                            // roughnessMap={roughness}
                            roughness={1}
                            // normalMap={normal}
                            // normalScale={_normalScale}
                            {...props}
                        />
                    )}
                </Reflector> */}
                    {/** <TransformControls> */}
                    {children}
                    {/** </TransformControls> */}


                    <OrbitControls
                        maxDistance={30}
                    />
                    <Environment
                        // preset='warehouse'  
                        background
                        files={['ev.jpg', 'ev.jpg', 'ev.jpg', 'ev.jpg', 'ev.jpg', 'ev.jpg']}
                        path='/envFiles/'

                    />
                </Suspense>


            </Canvas>
        </div>

    )
}

export default Scene3d;