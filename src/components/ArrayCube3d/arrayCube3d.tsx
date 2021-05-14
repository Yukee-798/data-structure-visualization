import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, config } from 'react-spring/three'
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { BASE_POSY, CUBE_INTERVAL_DISTANCE, IGeometryProps } from '../../types';
import { quickSortSeq } from '../../utils/sort';


interface IArrayCube3dProps extends IGeometryProps {
    value: string;
    sortIndex: number;
    swapIndexes: [number, number] | [];
    startPos: any;
}

const ArrayCube3d: React.FC<IArrayCube3dProps> = (props) => {

    const {
        position,
        isActive,
        isLock,
        isReset,
        value,
        sortIndex,
        startPos,
        swapIndexes,
        colorConfig,
    } = props;

    const [isHover, setIsHover] = useState(false)
    const [isClick, setIsClick] = useState(false)
    const meshRef = useRef<THREE.Mesh>(null!)


    /** 扫描数组的时候，如果改变了 active 属性，则给它设置一个点击效果 */
    useEffect(() => {
        isActive ? setIsClick(true) : setIsClick(false);
    }, [isActive])

    /** 配置扩缩动画效果 */
    const { scale } = useSpring({
        reset: isReset,
        reverse: isReset,
        from: { scale: 0 },
        to: { scale: isClick ? 1.10 : 1 },
        config: isReset ? config.default : config.wobbly
    })

    /** 配置颜色过渡效果 */
    const { color } = useSpring({
        color: (
            isClick ? colorConfig?.activeColor :
                isHover ? colorConfig?.hoverColor :
                    isLock ? colorConfig?.lockColor : colorConfig?.defaultColor
        )
    })

    /** 根据传入的排序下标，获取到 cube 所在的 X 坐标 */
    const getPosX = (sortIndex: number) => startPos + (sortIndex * CUBE_INTERVAL_DISTANCE);

    /** 交换元素时，获取其起始位置 */
    const getOrginPosX = () => {
        return getPosX(sortIndex as number);
    }

    /** 交换元素时，获取其目标位置 */
    const getTargetPosX = () => {
        return getPosX((swapIndexes[0] === sortIndex ? swapIndexes[1] : swapIndexes[0]) as number);
    }

    const delta = 0.2;
    const oldPosX = getOrginPosX();
    const targetPosX = getTargetPosX();


    useEffect(() => {
        let a = [3,2,1, -2, 0, 11, 9];
        quickSortSeq(a, 0, a.length - 1);
        console.log(a);
    }, [])

    useFrame(({ clock }) => {


        // 现在问题是，只要 swapIndexes 一变化



        // 如果有需要交换的两个元素
        if (swapIndexes.includes(sortIndex as never)) {


            // mesh 需要往右移
            if (oldPosX - targetPosX < 0 && meshRef.current.position.x < targetPosX) {
                meshRef.current.translateX(delta);
                if (meshRef.current.position.x >= targetPosX) {
                    meshRef.current.position.x = targetPosX;
                }
            } 

            // mesh 需要往左移
            else if (oldPosX - targetPosX > 0 && meshRef.current.position.x > targetPosX) {
                meshRef.current.translateX(-delta);
                if (meshRef.current.position.x <= targetPosX) {
                    meshRef.current.position.x = targetPosX;
                }
            }
        }

        // let i = 
        // console.log(clock.getDelta());
        // console.log(clock.getElapsedTime());
        // const oldPosx = 1
        // /** 平移前一次的 posX 和最新的 posX 差值  */
        // // meshRef.current.translateX(clock.getElapsedTime())
    })

    return (
        <animated.mesh
            scale={scale}
            ref={meshRef}
            position={position}
        >
            <Text
                fontSize={0.5}
                color='black'
            >
                {value}
            </Text>
            <RoundedBox
                args={[1, (+value) * 0.2, 1]}
                onClick={() => setIsClick(!isClick)}
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
}

ArrayCube3d.defaultProps = {
    colorConfig: {
        defaultColor: 'wheat',
        activeColor: 'orange',
        hoverColor: 'skyblue',
        lockColor: '#8076a3'
    }
}

export default React.memo(ArrayCube3d);