import { Line } from '@react-three/drei'
import { Points } from '../../types';

interface IArrow3d {
    points: Points;
    hidden?: boolean;
    lineWidth?: number;
}

const Arrow3d: React.FC<IArrow3d> = (props) => {

    const {
        points,
        hidden,
        lineWidth
    } = props;

    const point2 = points[1];

    return (
        <>
            <Line 
                lineWidth={(lineWidth as number) * 1.5}
                points={[[point2[0] - 0.2, point2[1] + 0.2, 0], point2]}
                color={'gray'}
                opacity={hidden ? 0 : 1}
                transparent={true}
            />
            <Line
                lineWidth={lineWidth}
                points={points}
                color={'gray'}
                opacity={hidden ? 0 : 1}
                transparent={true}
            />

            <Line 
                lineWidth={(lineWidth as number) * 1.5}
                points={[[point2[0] - 0.2, point2[1] - 0.2, 0], point2]}
                color={'gray'}
                opacity={hidden ? 0 : 1}
                transparent={true}
            />
        </>

    )
}

Arrow3d.defaultProps = {
    lineWidth: 1.5
}

export default Arrow3d;