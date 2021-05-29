import { useEffect, useRef, useState, forwardRef } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import { animated, config, useSpring } from "react-spring/three";
import { IGeometryProps } from "../../types";
import { defaultGeoColor } from "../../configs/page/defaultConfig";

export interface ICube3dProps extends IGeometryProps {
    ref?: any;
}

const Cube3d: React.FC<ICube3dProps> = forwardRef<any, ICube3dProps>((props, ref) => {
    const {
        args,
        position,
        isActive,
        isLock,
        value,
        colorConfig,
        disappear
    } = props;

    const [isHover, setIsHover] = useState(false)
    const [isClick, setIsClick] = useState(false)
    const meshRef = useRef<THREE.Mesh>(null!)

    /** 配置扩缩动画效果 */
    const { scale } = useSpring({
        reverse: disappear,
        from: { scale: 0 },
        to: { scale: isClick ? 1.10 : 1 },
        config: disappear ? config.default : config.wobbly
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


    return (
        <animated.mesh
            scale={scale}
            position={position}
            ref={ref}
        >
            <Text
                fontSize={0.5}
                color='black'
            >
                {value}
            </Text>
            <RoundedBox
                args={args}
                ref={meshRef}
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
})

Cube3d.defaultProps = {
    colorConfig: defaultGeoColor
}

export default Cube3d;