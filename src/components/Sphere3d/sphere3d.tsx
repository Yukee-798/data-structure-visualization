import { IColorConfig, IGeometryProps } from '../../types';
import { Icosahedron, Text } from '@react-three/drei'
import { animated, config, useSpring } from 'react-spring/three';
import { useEffect, useRef, useState } from 'react';

export interface ISphere3dProps extends IGeometryProps {

}

const Sphere3d: React.FC<ISphere3dProps> = (props) => {

    const {
        position,
        value,
        isActive,
        isLock,
        isSpRev,
        colorConfig,
    } = props;

    const [isHover, setIsHover] = useState(false)
    const [isClick, setIsClick] = useState(false)
    const meshRef = useRef<THREE.Mesh>(null!)

    /** 配置颜色过渡效果 */
    const { color } = useSpring({
        color: (
            isClick ? colorConfig?.activeColor :
                isHover ? colorConfig?.hoverColor :
                    isLock ? colorConfig?.lockColor : colorConfig?.defaultColor
        )
    })

    /** 配置扩缩动画效果 */
    const { scale } = useSpring({
        reset: isSpRev,
        reverse: isSpRev,
        from: { scale: 0 },
        to: { scale: isClick ? 1.20 : 1 },
        config: isSpRev ? config.default : config.wobbly
    })

    /** 扫描数组的时候，如果改变了 active 属性，则给它设置一个点击效果 */
    useEffect(() => {
        isActive ? setIsClick(true) : setIsClick(false);
    }, [isActive])

    return (
        <animated.mesh
            position={position}
            ref={meshRef}
            scale={scale}
        >
            <Icosahedron
                args={[0.7, 10]}
                onClick={() => setIsClick(!isClick)}
                onPointerOver={() => setIsHover(true)}
                onPointerOut={() => setIsHover(false)}
            >
                <Text
                    position={[0, 0, 0.7]}
                    fontSize={0.5}
                    color='black'
                >
                    {value}
                </Text>

                <animated.meshPhongMaterial
                    color={color}
                    opacity={1}
                />
            </Icosahedron>
        </animated.mesh>
    )
}

Sphere3d.defaultProps = {
    colorConfig: {
        defaultColor: 'wheat',
        activeColor: 'orange',
        hoverColor: 'skyblue',
        lockColor: '#8076a3'
    }
}

export default Sphere3d;