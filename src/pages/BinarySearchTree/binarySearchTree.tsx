import { Button } from 'antd'
import Line3d from '../../components/Line3d/line3d'
import Scene3d from '../../components/Scene3d/scene3d'
import Sphere3d from '../../components/Sphere3d/sphere3d'
import './binarySearchTree.scss'

const BinarySearchTree = () => {
    return (
        <div className='binarySearchTree-warp'>
            <div className='console-warp'>
                <Button>
                    Preorder
                </Button>
                <Button>
                    Inorder
                </Button>
                <Button>
                    Postorder

                </Button>
            </div>

            <Scene3d>
                <Sphere3d position={[0, 8, 0]} />
                {/** <Line3d points={[[0 - 0.65, 8 - 0.25, 0], [-4 + 0.65, 6 + 0.25, 0]]} /> */}
                <Sphere3d position={[-4, 6, 0]} />
                <Sphere3d position={[4, 6, 0]} />



                <Sphere3d position={[-8, 4, 0]} />
                <Sphere3d position={[8, 4, 0]} />
                <Sphere3d position={[-12, 2, 0]} />
                <Sphere3d position={[12, 2, 0]} />
                <Sphere3d position={[-16, 0, 0]} />
                <Sphere3d position={[16, 0, 0]} />
            </Scene3d>


        </div>
    )
}

export default BinarySearchTree;