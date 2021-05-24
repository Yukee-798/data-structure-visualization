import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, config } from 'react-spring/three'
import { RoundedBox, Text } from "@react-three/drei";
import { IGeometryProps } from '../../../types';

interface IStackCube3dProps extends IGeometryProps {
}

const StackCube3d: React.FC<IStackCube3dProps> = (props) => {

    const {
        position,
        isActive,
        isLock,
        isSpRev,
        value,
        colorConfig,
        disappear
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
        reverse: disappear || isSpRev,
        from: { scale: 0 },
        to: { scale: isClick ? 1.10 : 1 },
        config: (disappear || isSpRev) ? config.default : config.wobbly
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
                args={[2.5, .5, 2.5]}
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

StackCube3d.defaultProps = {
    colorConfig: {
        defaultColor: 'wheat',
        activeColor: 'orange',
        hoverColor: 'skyblue',
        lockColor: '#8076a3'
    }
}

export default React.memo(StackCube3d);