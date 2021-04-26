import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'




const Cuboid3d: React.FC<JSX.IntrinsicElements['mesh']> = (props) => {



    // 获取 mesh 实例
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)


    // 开启渲染循环，让 mesh 沿着 x 轴转动
    useFrame(({clock}) => {
        meshRef.current.rotation.x = clock.getElapsedTime();
    })
    return (
        <mesh
            {...props}

            ref={meshRef}
            scale={active ? 10 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
        >
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

export default Cuboid3d;