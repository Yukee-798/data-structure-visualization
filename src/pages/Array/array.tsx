import { Canvas } from '@react-three/fiber';
import Cuboid3d from '../../components/Cuboid3d/cuboid3d'
import './array.scss'

const Array = () => {
    return (
        <div className='array-warp'>

            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />

                <Cuboid3d
                    position={[-3.2, 0, 0]}
                />
                <Cuboid3d
                    position={[3.2, 0, 0]}
                />
            </Canvas>

        </div>
    )
}

export default Array;