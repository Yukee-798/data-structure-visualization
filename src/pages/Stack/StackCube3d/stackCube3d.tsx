import React from 'react'
import Cube3d, { ICube3dProps } from '../../../components/Cube3d/cube3d';

interface IStackCube3dProps extends ICube3dProps {
}

const StackCube3d: React.FC<IStackCube3dProps> = (props) => {
    return (
        <Cube3d 
            args={[2.5, .5, 2.5]}
            {...props}
        />
    )
}

export default React.memo(StackCube3d);