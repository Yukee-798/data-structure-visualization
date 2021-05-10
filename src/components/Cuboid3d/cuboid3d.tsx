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
    isReset?: boolean;
}

/**
 * 使用该组件时必须传入类型cubeConfig，否则不会渲染
 */
const Cuboid3d: React.FC<ICuboid3d> = (props) => {

    const {
        position,
        isActive,
        isLock,
        isReset,
        arrCubeConfig,
        colorConfig,
    } = props;

    const [isHover, setIsHover] = useState(false)
    const [isClick, setIsClick] = useState(false)
    const meshRef = useRef<THREE.Mesh>(null!)

    // const [posX, setPosX] = useState<number>(() => {
    //     if (arrCubeConfig) return (arrCubeConfig.startPos + (arrCubeConfig.sortIndex * 2.5))
    // })



    useEffect(() => {
        console.log(arrCubeConfig?.sortIndex, arrCubeConfig?.startPos);
    }, [arrCubeConfig])

    /* 扫描数组的时候，如果改变了 active 属性，则给它设置一个点击效果 */
    useEffect(() => {
        isActive ? setIsClick(true) : setIsClick(false);
    }, [isActive])

    /* 配置扩缩动画效果 */
    const { scale } = useSpring({
        reset: isReset,
        reverse: isReset,
        from: { scale: 0 },
        to: { scale: isClick ? 1.15 : 1 },
        config: isReset ? config.default : config.wobbly
    })

    /* 配置颜色过渡效果 */
    const { color } = useSpring({
        color: (
            isClick ? colorConfig?.activeColor :
                isHover ? colorConfig?.hoverColor :
                    isLock ? colorConfig?.lockColor : colorConfig?.defaultColor
        )
    })

    /* 配置swap的动画效果 */
    const { posX } = useSpring({
        from: { posX: 0 },
        // to: { posX: ((arrCubeConfig as IArrCubeConfig).startPos + ((arrCubeConfig as IArrCubeConfig).sortIndex * 2.5)) as number }
        to: { posX: 1 },
        config: config.wobbly
        // posX: ((arrCubeConfig as IArrCubeConfig).startPos + ((arrCubeConfig as IArrCubeConfig).sortIndex * 2.5)) as number
    })

    // 开启渲染循环，让 mesh 沿着 x 轴转动
    useFrame(({ clock }) => {
        
        // meshRef.current.position.x = clock.getElapsedTime();
        // let temp = 
        meshRef.current.position.x = (arrCubeConfig as IArrCubeConfig).startPos + ((arrCubeConfig as IArrCubeConfig).sortIndex * 2.5);
    })

    if (arrCubeConfig) {
        return (
            <animated.mesh
                ref={meshRef}
                scale={scale}
                // position={position || [, 0, 0]}
                position={position || [(arrCubeConfig as IArrCubeConfig).startPos + ((arrCubeConfig as IArrCubeConfig).sortIndex * 2.5), 0, 0]}
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
        lockColor: '#8076a3'
    },
    isLock: false,
}

export default React.memo(Cuboid3d);