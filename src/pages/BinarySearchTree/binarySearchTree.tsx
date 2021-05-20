import { Fragment, useEffect, useReducer, useState } from 'react'
import { useHistory } from 'react-router'
import { Button, Input, PageHeader } from 'antd'
import { BarChartOutlined, DotChartOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons'
import Console, { Item, SubMenu } from '../../components/Console/console'
import Line3d from '../../components/Line3d/line3d'
import Scene3d from '../../components/Scene3d/scene3d'
import Sphere3d from '../../components/Sphere3d/sphere3d'
import { ActionTypes, DISPATCH_INTERVAL, IGeometryProps, Points } from '../../types'
import { randomBST, getDeepthByNodeIndex, getLChildValue, getRChildValue, initSpheres, inOrderSeq, postOrderSeq, preOrderSeq } from '../../utils/binaryTree'
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

        case ActionTypes.Active:
            return {
                ...state,
                spheres: state.spheres.map(
                    (item) => payload === item.sortIndex ? { ...item, isActive: true } : { ...item }
                )
            }

        case ActionTypes.Deactive:
            return {
                ...state,
                spheres: state.spheres.map(
                    (item) => payload === item.sortIndex ? { ...item, isActive: false } : { ...item }
                )
            }

        case ActionTypes.Lock:
            return {
                ...state,
                spheres: state.spheres.map(
                    (item) => payload === item.sortIndex ? { ...item, isLock: true } : { ...item }
                )
            }

        case ActionTypes.UnLock:
            return {
                ...state,
                spheres: state.spheres.map(
                    (item) => payload === item.sortIndex ? { ...item, isLock: false } : { ...item }
                )
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            }

        case ActionTypes.RandomDone:
            {
                let newBinaryTree = randomBST();
                return {
                    ...state,
                    binaryTree: newBinaryTree,
                    spheres: initSpheres(newBinaryTree),
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
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
        const initBinaryTree = randomBST();
        return {
            ...state,
            binaryTree: initBinaryTree,
            spheres: initSpheres(initBinaryTree)
        }
    });

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 控制台的添加删除元素的value和index */
    const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 获取二叉树的最大层数 */
    const maxDeepth = getDeepthByNodeIndex(state.binaryTree.length - 1);

    /** 添加元素 */
    const handleAddEle = () => {
        console.log(value, index);
    }

    /** 删除元素 */
    const handleDeleteEle = () => {

    }

    /** 随机生成数据 */
    const handleRandom = () => {
        dispatch({ type: ActionTypes.Random });
        setTimeout(() => {
            dispatch({ type: ActionTypes.RandomDone })
        }, 400);
    }

    /** 前序遍历 */
    const handlePreorder = () => {
        let sequence: any[] = [];
        preOrderSeq(state.binaryTree, 0, sequence);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.index })
            }, i * DISPATCH_INTERVAL)
        })
    }

    /** 中序遍历 */
    const handleInorder = () => {
        let sequence: any[] = [];
        inOrderSeq(state.binaryTree, 0, sequence);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.index })
            }, i * DISPATCH_INTERVAL)
        })
    }

    /** 后序遍历 */
    const handlePostorder = () => {
        let sequence: any[] = [];
        postOrderSeq(state.binaryTree, 0, sequence);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.index })
            }, i * DISPATCH_INTERVAL)
        })
    }




    return (
        <div className='binarySearchTree-warp'>
            <PageHeader
                onBack={() => {
                    history.goBack();
                    window.location.reload();
                }}
                title='二叉搜索树'
            />
            <div className='main'>
                <Scene3d onLoaded={handleSceneLoaded}>
                    {state.spheres.map((sphere, i) => {
                        // 当前结点所在层数
                        const curDeepth = getDeepthByNodeIndex(i);

                        // 当前结点的左孩子值
                        const curLChildValue = getLChildValue(state.spheres, i)?.value;

                        // 当前结点的右孩子值
                        const curRChildValue = getRChildValue(state.spheres, i)?.value;

                        // 当前结点JSX
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
                <Console
                    style={{ display: isSceneLoaded ? 'inline-block' : 'none' }}
                >
                    <Item
                        icon={<DotChartOutlined />}
                        onClick={handleRandom}
                    >
                        随机生成
                    </Item>

                    <SubMenu
                        key='2'
                        icon={<BarChartOutlined />}
                        title='遍历'
                    >
                        <Item onClick={handlePreorder}>前序遍历</Item>
                        <Item onClick={handleInorder}>中序遍历</Item>
                        <Item onClick={handlePostorder}>后序遍历</Item>
                    </SubMenu>

                    <SubMenu
                        icon={<PlusSquareOutlined />}
                    >
                        <Item>
                            <Input />
                            <Button>添加</Button>
                        </Item>
                    </SubMenu>

                    <Item icon={<MinusSquareOutlined />}>删除</Item>

                </Console>

            </div>
        </div>
    )
}

export default BinarySearchTree;