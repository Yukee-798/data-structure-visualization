import { Line } from '@react-three/drei'
import { Points } from '../../types';

interface ILine3dProps {
    points: Points;
    hidden: boolean;
    lineWidth?: number;
    isActive?: boolean;
}

const Line3d:React.FC<ILine3dProps> = (props) => {

    const {
        points,
        hidden,
        lineWidth,
        isActive
    } = props;

    return (
        <Line
            // ref={}
            lineWidth={lineWidth}
            points={points}
            color={isActive ? 'orange' : 'gray'}
            opacity={hidden ? 0 : 1}
            transparent={true}
        />

    )
}

Line3d.defaultProps = {
    lineWidth: 1.5
}

export default Line3d;