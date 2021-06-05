import { forwardRef, useEffect, useRef, useState } from 'react';
import { animated, config, useSpring } from '@react-spring/three';
import { Icosahedron, Text } from '@react-three/drei'
import { defaultGeoColor } from '../../configs/page/defaultConfig';
import { IGeometryProps } from '../../types';

export interface ISphere3dProps extends IGeometryProps {
    /** 结点的实际顺序 */
    sortIndex: number;
    /** 该sphere过去已存在或者未来将要到达的位置 */
    sortIndexes: number[];
    /** 左线条位置 */
    lChildPos?: any;
    /** 右线条位置 */
    rChildPos?: any;
    /** 激活左线条 */
    activeLeft?: boolean;
    /** 激活右线条 */
    activeRight?: boolean;
}

const Sphere3d: React.FC<ISphere3dProps> = forwardRef<any, ISphere3dProps>((props, ref) => {

    const {
        position,
        value,
        isActive,
        isLock,
        colorConfig,
        disappear
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
        reverse: disappear,
        from: { scale: 0 },
        to: { scale: isClick ? 1.20 : 1 },
        config: disappear ? config.default : config.wobbly
    })

    /** 扫描数组的时候，如果改变了 active 属性，则给它设置一个点击效果 */
    useEffect(() => {
        isActive ? setIsClick(true) : setIsClick(false);
    }, [isActive])

    return (
        <animated.mesh
            position={position}
            ref={ref}
            scale={scale}
        >
            <Icosahedron
                ref={meshRef}
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
})

Sphere3d.defaultProps = {
    colorConfig: defaultGeoColor
}

export default Sphere3d;