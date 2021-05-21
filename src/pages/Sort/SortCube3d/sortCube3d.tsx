import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, config } from 'react-spring/three'
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { BASE_POSY, SORT_CUBE_INTERVAL_DISTANCE, IGeometryProps, DISPATCH_INTERVAL } from '../../../types';
import { quickSortSeq } from '../../../utils/sort';

interface ISortCube3dProps extends IGeometryProps {
    sortIndexes: number[];
    sortIndex: number;
    startPosX: any;
}

const SortCube3d: React.FC<ISortCube3dProps> = (props) => {

    const {
        position,
        isActive,
        isLock,
        isReset,
        value,
        sortIndexes,
        sortIndex,
        startPosX,
        colorConfig,
    } = props;

    const [isHover, setIsHover] = useState(false)
    const [isClick, setIsClick] = useState(false)
    const meshRef = useRef<THREE.Mesh>(null!)

    /** 根据传入的排序下标，获取到 cube 所在的 X 坐标 */
    const getPosX = (sortIndex: number) => startPosX + (sortIndex * SORT_CUBE_INTERVAL_DISTANCE);

    /** 移动元素时，获取其起始位置 */
    const getOrginPosX = () => {
        return getPosX(sortIndex);
    }

    /** 移动元素时，获取其目标位置 */
    const getTargetPosX = () => {
        return getPosX(sortIndexes[sortIndexes.length - 1]);
    }

    const oldPosX = getOrginPosX();
    const targetPosX = getTargetPosX();

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

    /** 扫描数组的时候，如果改变了 active 属性，则给它设置一个点击效果 */
    useEffect(() => {
        isActive ? setIsClick(true) : setIsClick(false);
    }, [isActive])

    
    useFrame(() => {

        const delta = Math.abs(oldPosX - targetPosX) / (DISPATCH_INTERVAL / 20);

        // 如果当前 sortIndex 需要改变
        if (delta) {
        
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
                args={[1, (value as number) * 0.2, 1]}
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

SortCube3d.defaultProps = {
    colorConfig: {
        defaultColor: 'wheat',
        activeColor: 'orange',
        hoverColor: 'skyblue',
        lockColor: '#8076a3'
    }
}

export default React.memo(SortCube3d);