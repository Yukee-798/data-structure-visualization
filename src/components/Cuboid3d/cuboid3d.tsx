import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, config } from '@react-spring/three'
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'


interface ICuboid3d {
    position?: any;
    data?: string;
    // ref?: any;
    defColor?: string;

}

const Cuboid3d: React.FC<ICuboid3d> = (props) => {

    // 获取 mesh 实例
    const [isHover, setIsHover] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const { position, data, defColor } = props;

    // 配置动画效果
    const { scale } = useSpring({
        
        // scale 值改变的时候会平滑过渡
        scale: isActive ? 1.5 : 1,
        // 添加颤抖效果
        config: config.wobbly
    });

    const { color } = useSpring({
        color: isActive ? '#2c9678' : isHover ? 'skyblue' : 'wheat'
    })




    // 开启渲染循环，让 mesh 沿着 x 轴转动
    // useFrame(({clock}) => {
    //     meshRef.current.rotation.x = clock.getElapsedTime();
    // })
    return (
        <animated.mesh
            scale={scale}
            position={position}
            // ref={ref}
        >
            <Text
                fontSize={0.5}
                color='black'
            >
                {data}
            </Text>
            <RoundedBox
                args={[2, 1, 1]}
                onClick={() => {
                    setIsActive(!isActive)
                }}
                onPointerOver={() => setIsHover(true)}
                onPointerOut={() => setIsHover(false)}

            >
                <animated.meshPhongMaterial
                    color={defColor || color}
                    //         vertexColors={true}

                    //         color={[0xffff00, 0xff00ff, 0x00ffff]}
                    //         // color='skyblue'
                    //         specular={new THREE.Color(0x4488ee)}
                    //         shininess={12}
                    opacity={0.5}

                    //         // wireframeLinewidth={3}
                    //         // wireframe={true}
                    transparent={true}
                />
            </RoundedBox>
        </animated.mesh>
    )
}

export default Cuboid3d;