import React from 'react'
import Cube3d, { ICube3dProps } from '../../../components/Cube3d/cube3d';

interface IQueueCube3dProps extends ICube3dProps {
}

const QueueCube3d: React.FC<IQueueCube3dProps> = (props) => {

    return (
        <Cube3d
            args={[2, 1, 1]}
            {...props}
        />
    )
}

export default React.memo(QueueCube3d);