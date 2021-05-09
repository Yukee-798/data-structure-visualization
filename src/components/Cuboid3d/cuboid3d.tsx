import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, config } from '@react-spring/three'
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { IColorConfig } from '../../types';




interface IArrCubeConfig {
    value: string
    sortIndex: number;
    startPos: any;
}


interface ICuboid3d {
    /* 颜色配置 */
    colorConfig?: IColorConfig;
    /* 数组cube配置 */
    arrCubeConfig?: IArrCubeConfig;

    /* 通用配置 */
    position?: any;
    isActive?: boolean;
    isLock?: boolean;
}

const Cuboid3d: React.FC<ICuboid3d> = (props) => {

    const {
        position,
        isActive,
        isLock,
        arrCubeConfig,
        colorConfig,
    } = props;

    const [isHover, setIsHover] = useState(false)
    const [isClick, setIsClick] = useState(false)
    console.log(isLock);
    /* 扫描数组的时候，如果改变了 active 属性，则给它设置一个点击效果 */
    useEffect(() => {
        isActive ? setIsClick(true) : setIsClick(false);
    }, [isActive])

    /* 配置扩缩动画效果 */
    const { scale } = useSpring({
        // scale 值改变的时候会平滑过渡
        scale: isClick ? 1.15 : 1,
        // 添加颤抖效果
        config: config.wobbly
    });

    /* 配置颜色过渡效果 */
    const { color } = useSpring({
        color: (
            isClick ? colorConfig?.activeColor :
            isHover ? colorConfig?.hoverColor : 
            isLock ? colorConfig?.lockColor : colorConfig?.defaultColor
        )
    })

    // 开启渲染循环，让 mesh 沿着 x 轴转动
    // useFrame(({clock}) => {
    //     meshRef.current.rotation.x = clock.getElapsedTime();
    // })

    if (arrCubeConfig) {
        return (
            <animated.mesh
                scale={scale}
                position={position}
                // trans
                // ref={ref}
            >
                <Text
                    fontSize={0.5}
                    color='black'
                >
                    {arrCubeConfig?.value}
                </Text>
                <RoundedBox
                    args={[2, 1, 1]}
                    onClick={() => {
                        setIsClick(!isClick)
                    }}
                    onPointerOver={() => setIsHover(true)}
                    onPointerOut={() => setIsHover(false)}

                >
                    <animated.meshPhongMaterial
                        color={color}
                        opacity={0.5}
                        transparent={true}
                        // vertexColors={true}
                        // color={[0xffff00, 0xff00ff, 0x00ffff]}
                        // specular={new THREE.Color(0x4488ee)}
                        // shininess={12}
                        // wireframeLinewidth={3}
                        // wireframe={true}
                    />
                </RoundedBox>
            </animated.mesh>
        )
    } else {
        return (
            <></>
        )
    }
}


Cuboid3d.defaultProps = {
    colorConfig: {
        defaultColor: 'wheat',
        activeColor: 'orange',
        hoverColor: 'skyblue',
        lockColor: 'purple'
    },
    position: [0, 0, 0],
    isLock: false,
}

export default Cuboid3d;