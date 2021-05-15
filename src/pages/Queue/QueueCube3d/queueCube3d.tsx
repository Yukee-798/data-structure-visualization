import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, config } from 'react-spring/three'
import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { BASE_POSY, SORT_CUBE_INTERVAL_DISTANCE, IGeometryProps } from '../../../types';
import { quickSortSeq } from '../../../utils/sort';


interface IQueueCube3dProps extends IGeometryProps {
    value: string;
    startPosX: any;
}

const QueueCube3d: React.FC<IQueueCube3dProps> = (props) => {

    const {
        position,
        isActive,
        isLock,
        isReset,
        value,
        startPosX,
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
                args={[2, 1, 1]}
                onClick={() => setIsClick(!isClick)}
                onPointerOver={() => setIsHover(true)}
                onPointerOut={() => setIsHover(false)}
            >
                <animated.meshPhongMaterial
                    color={color}
                    opacity={0.5}
                    transparent={true}
                />
            </RoundedBox>
        </animated.mesh>
    )
}

QueueCube3d.defaultProps = {
    colorConfig: {
        defaultColor: 'wheat',
        activeColor: 'orange',
        hoverColor: 'skyblue',
        lockColor: '#8076a3'
    }
}

export default React.memo(QueueCube3d);