import { Line } from '@react-three/drei'
import { Points } from '../../types';

interface ILine3dProps {
    points: Points;
    hidden: boolean;
    lineWidth?: number;
}

const Line3d:React.FC<ILine3dProps> = (props) => {

    const {
        points,
        hidden,
        lineWidth
    } = props;

    return (
        <Line
            lineWidth={lineWidth}
            points={points}
            color={'gray'}
            opacity={hidden ? 0 : 1}
            transparent={true}
        />

    )
}

Line3d.defaultProps = {
    lineWidth: 1.5
}

export default Line3d;