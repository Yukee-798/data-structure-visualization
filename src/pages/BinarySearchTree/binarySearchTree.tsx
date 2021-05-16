import { Button } from 'antd'
import { useEffect } from 'react'
import Console from '../../components/Console/console'
import Line3d from '../../components/Line3d/line3d'
import Scene3d from '../../components/Scene3d/scene3d'
import Sphere3d, { ISphere3dProps } from '../../components/Sphere3d/sphere3d'
import { IGeometryProps } from '../../types'
import { getRChildValue } from '../../utils/binaryTree'
import './binarySearchTree.scss'


export interface ISphere extends IGeometryProps {

}

interface IState {
    values: (number | string)[];
    spheres: ISphere[];
}

const initState: IState = {
    values: [1, 2, 3, 4, 5, 6, 7, 8],
    spheres: []
}

// [1, 2, 3, 4, 5, 6]



const BinarySearchTree = () => {
    useEffect(() => {
        const tree = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

        // getRChildValue()
        console.log(getRChildValue(tree, 3));
    }, [])

    const preOrder = (tree: number[]) => {

    }

    // const arrayToBinaryTree = (array: (number | string)[]) => {
    //     const binaryTreeJSX = [];
    //     const pushedIndexes = [];

    //     array.forEach((item, i) => {
    //         if (!pushedIndexes.includes(i * 2, i * 2 + 1)) {

    //         }
    //     })
    // }

    return (
        <div className='binarySearchTree-warp'>
            {/* {[<div>123</div>, <div>222</div>]} */}

            <Scene3d>
                {/* 第一排 */}
                <Sphere3d position={[0, 8, 0]} value={'1'} />
                <Line3d points={[[0, 8, 0], [-4, 5, 0]]} />
                <Line3d points={[[0, 8, 0], [4, 5, 0]]} />

                {/* 第二排 */}
                <Sphere3d position={[-4, 5, 0]} value={'2'} />
                <Line3d points={[[-4, 5, 0], [-6, 2, 0]]} />
                <Line3d points={[[-4, 5, 0], [-2, 2, 0]]} />

                <Sphere3d position={[4, 5, 0]} value={'3'} />
                <Line3d points={[[4, 5, 0], [2, 2, 0]]} />
                <Line3d points={[[4, 5, 0], [6, 2, 0]]} />

                {/* 第三排 */}
                <Sphere3d position={[-6, 2, 0]} value={'4'} />
                <Line3d points={[[-6, 2, 0], [-7, -1, 0]]} />
                <Line3d points={[[-6, 2, 0], [-5, -1, 0]]} />

                <Sphere3d position={[-2, 2, 0]} value={'5'} />
                <Line3d points={[[-2, 2, 0], [-3, -1, 0]]} />
                <Line3d points={[[-2, 2, 0], [-1, -1, 0]]} />

                <Sphere3d position={[2, 2, 0]} value={'6'} />
                <Line3d points={[[2, 2, 0], [1, -1, 0]]} />
                <Line3d points={[[2, 2, 0], [3, -1, 0]]} />

                <Sphere3d position={[6, 2, 0]} value={'7'} />
                <Line3d points={[[6, 2, 0], [5, -1, 0]]} />
                <Line3d points={[[6, 2, 0], [7, -1, 0]]} />

                {/* 第四排 */}
                <Sphere3d position={[-7, -1, 0]} value={'8'} />
                <Sphere3d position={[-5, -1, 0]} value={'9'} />
                <Sphere3d position={[-3, -1, 0]} value={'10'} />
                <Sphere3d position={[-1, -1, 0]} value={'11'} />
                <Sphere3d position={[1, -1, 0]} value={'12'} />
                <Sphere3d position={[3, -1, 0]} value={'13'} />
                <Sphere3d position={[5, -1, 0]} value={'14'} />
                <Sphere3d position={[7, -1, 0]} value={'15'} />




                {/* <Sphere3d position={[8, 4, 0]} value={'123'} />
                <Sphere3d position={[-12, 2, 0]} value={'123'} />
                <Sphere3d position={[12, 2, 0]} value={'123'} />
                <Sphere3d position={[-16, 0, 0]} value={'123'} />
                <Sphere3d position={[16, 0, 0]} value={'123'} /> */}
            </Scene3d>

            <Console>
                <Button>
                    Preorder
                </Button>
                <Button>
                    Inorder
                </Button>
                <Button>
                    Postorder

                </Button>
            </Console>
        </div>
    )
}

export default BinarySearchTree;