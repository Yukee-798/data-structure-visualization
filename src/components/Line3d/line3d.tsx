import { Line } from '@react-three/drei'
import { Points } from '../../types';
// import { animated } from '@react-spring/three'


interface ILine3dProps {
    points: Points;
    lineWidth?: number
}

const Line3d:React.FC<ILine3dProps> = (props) => {

    const {
        points,
        lineWidth
    } = props;

    return (
        <Line
            lineWidth={lineWidth}
            points={points}
        />

    )
}

Line3d.defaultProps = {
    lineWidth: 2
}

export default Line3d;