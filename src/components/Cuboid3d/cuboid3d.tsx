import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, config } from '@react-spring/three'
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { BASE_POSY, CUBE_INTERVAL_DISTANCE, IGeometryProps } from '../../types';

interface IArrCubeConfig {
    value: string
    sortIndex: number;
    startPos: any;
}

interface ILinkCubeConfig {

}

interface ICuboid3dProps extends IGeometryProps {
    /* 数组cube配置 */
    arrCubeConfig?: IArrCubeConfig;

    /* 链表cube配置 */
    // linkCubeConfig?
}

/**
 * 使用该组件时必须传入类型cubeConfig，否则不会渲染
 */
const Cuboid3d: React.FC<ICuboid3dProps> = (props) => {

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


    /* 扫描数组的时候，如果改变了 active 属性，则给它设置一个点击效果 */
    useEffect(() => {
        isActive ? setIsClick(true) : setIsClick(false);
    }, [isActive])

    /* 配置扩缩动画效果 */
    const { scale } = useSpring({
        reset: isReset,
        reverse: isReset,
        from: { scale: 0 },
        to: { scale: isClick ? 1.10 : 1 },
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

    // const { height } = useSpring({
    //     from: {height: 0},
    //     to: { height: ((+(arrCubeConfig as IArrCubeConfig).value) as number) * 0.2}
    // })

    /* 配置swap的动画效果 */
    // const { posX } = useSpring({
    //     from: { posX: 0 },
    //     // to: { posX: ((arrCubeConfig as IArrCubeConfig).startPos + ((arrCubeConfig as IArrCubeConfig).sortIndex * CUBE_INTERVAL_DISTANCE)) as number }
    //     to: { posX: 1 },
    //     config: config.wobbly
    //     // posX: ((arrCubeConfig as IArrCubeConfig).startPos + ((arrCubeConfig as IArrCubeConfig).sortIndex * CUBE_INTERVAL_DISTANCE)) as number
    // })

    // 开启渲染循环，让 mesh 沿着 x 轴转动
    // useFrame(({ clock }) => {

    //     // meshRef.current.position.x = clock.getElapsedTime();
    //     // let temp = 
    //     meshRef.current.position.x = (arrCubeConfig as IArrCubeConfig).startPos + ((arrCubeConfig as IArrCubeConfig).sortIndex * CUBE_INTERVAL_DISTANCE);
    // })


    const posX: number = (arrCubeConfig as IArrCubeConfig).startPos + ((arrCubeConfig as IArrCubeConfig).sortIndex * CUBE_INTERVAL_DISTANCE);

    useEffect(() => {
        // meshRef.current.translateOnAxis(new THREE.Vector3(posX, 0, 0), 1)
        
    }, [])

    if (arrCubeConfig) {
        return (
            <animated.mesh

                scale={scale}
                ref={meshRef}
                // scale={scale}
                // position={position || [, 0, 0]}

                // 由于 cube 的重心决定其位置，那么高度变化会导致其底部覆盖掉下面的 text，所以要改变其重心位置
                position={position || [posX, ((+arrCubeConfig.value as number) * 0.2) / 2 + BASE_POSY, 0]}
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
                    args={[1, (+arrCubeConfig.value as number) * 0.2, 1]}
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
    } else if (0) {
        return <></>
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