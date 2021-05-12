import { IColorConfig, IGeometryProps } from '../../types';
import { Icosahedron, Text } from '@react-three/drei'
import { animated } from '@react-spring/three';

interface ISphere3dProps extends IGeometryProps {

}

const Sphere3d: React.FC<ISphere3dProps> = (props) => {

    const {
        position,
        isActive,
        isLock,
        isReset,
        colorConfig,
    } = props;

    return (
        <animated.mesh
            position={position}
        >
            <Icosahedron
                args={[0.7, 10]}
            >
                <Text
                    fontSize={0.5}
                    color='black'
                >
                    123
                </Text>

                <animated.meshPhongMaterial
                    color={colorConfig?.defaultColor}
                    opacity={0.5}
                    transparent={true}
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
    },
    isLock: false,
}

export default Sphere3d;