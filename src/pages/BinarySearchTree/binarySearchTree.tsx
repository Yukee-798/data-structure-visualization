import { Button } from 'antd'
import { Fragment, useEffect, useReducer } from 'react'
import Console from '../../components/Console/console'
import Line3d from '../../components/Line3d/line3d'
import Scene3d from '../../components/Scene3d/scene3d'
import Sphere3d from '../../components/Sphere3d/sphere3d'
import { ActionTypes, IGeometryProps, Points } from '../../types'
import { getDeepthByNodeIndex, getLChildValue, getRChildValue, initSphere, randomBinaryTree } from '../../utils/binaryTree'
import './binarySearchTree.scss'


const cdnOfNodes: Points = [
    // 第一排
    [0, 5, 0],
    // 第二排
    [-4, 2, 0], [4, 2, 0],
    // 第三排
    [-6, -1, 0], [-2, -1, 0], [2, -1, 0], [6, -1, 0],
    // 第四排
    [-7, -4, 0], [-5, -4, 0], [-3, -4, 0], [-1, -4, 0], [1, -4, 0], [3, -4, 0], [5, -4, 0], [7, -4, 0]
]

export interface ISphere extends IGeometryProps {
    sortIndex: number;
}

interface IState {
    // 表示二叉树当前真实的结构
    binaryTree: (number | null)[];
    // 用来表示每个 sphere 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    spheres: ISphere[];
    randomDone: boolean;
}

interface IAction {
    type: ActionTypes;
    payload?: any;
}

type IReducer = (state: IState, action: IAction) => IState;

const initState: IState = {
    binaryTree: [],
    spheres: [],
    randomDone: true,
}

const reducer: IReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case ActionTypes.Random:

            return {
                ...state,
                randomDone: false
            }

        case ActionTypes.RandomDone:
            {
                let newBinaryTree = randomBinaryTree();
                return {
                    ...state,
                    binaryTree: newBinaryTree,
                    spheres: initSphere(newBinaryTree),
                    randomDone: true
                }
            }

        default:
            return {
                ...state
            }
    }
}


const BinarySearchTree = () => {

    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
        const initBinaryTree = randomBinaryTree();
        return {
            ...state,
            binaryTree: initBinaryTree,
            spheres: initSphere(initBinaryTree)
        }
    });

    // 获取二叉树的最大层数
    const maxDeepth = getDeepthByNodeIndex(state.binaryTree.length - 1);

    return (
        <div className='binarySearchTree-warp'>
            <Scene3d>
                {state.spheres.map((sphere, i) => {
                    // 当前节点所在层数
                    const curDeepth = getDeepthByNodeIndex(i);

                    // 当前节点的左孩子值
                    const curLChildValue = getLChildValue(state.spheres, i)?.value;

                    // 当前节点的右孩子值
                    const curRChildValue = getRChildValue(state.spheres, i)?.value;

                    // 当前节点JSX
                    let currentNodeJSX;

                    // 判空
                    if (sphere.value) {
                        currentNodeJSX = (curDeepth !== maxDeepth ?
                            <Fragment key={i + '('}>
                                <Sphere3d
                                    position={cdnOfNodes[i]}
                                    value={sphere.value}
                                    isActive={sphere.isActive}
                                    isLock={sphere.isLock}
                                    isReset={!state.randomDone}
                                />
                                {curLChildValue ? <Line3d hidden={!state.randomDone} points={[cdnOfNodes[i], getLChildValue(cdnOfNodes, i)]} /> : <></>}
                                {curRChildValue ? <Line3d hidden={!state.randomDone} points={[cdnOfNodes[i], getRChildValue(cdnOfNodes, i)]} /> : <></>}
                            </Fragment> :
                            <Sphere3d
                                key={i + '('}
                                position={cdnOfNodes[i]}
                                value={sphere.value}
                                isActive={sphere.isActive}
                                isLock={sphere.isLock}
                                isReset={!state.randomDone}
                            />);
                    } else {
                        currentNodeJSX = <Fragment key={i + '('}></Fragment>
                    }

                    return currentNodeJSX;
                })}
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
                <Button
                    onClick={() => {
                        /** 随机生成数据 */
                        dispatch({ type: ActionTypes.Random });
                        setTimeout(() => {
                            dispatch({ type: ActionTypes.RandomDone })
                        }, 400);
                    }}
                >随机生成</Button>
            </Console>
        </div>
    )
}

export default BinarySearchTree;