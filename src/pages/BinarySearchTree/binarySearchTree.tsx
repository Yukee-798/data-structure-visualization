import { useReducer, useState } from 'react'
import { useHistory } from 'react-router'
import { Button, PageHeader, Steps } from 'antd'
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons'
import Console, { Item, SubMenu } from '../../components/Console/console'
import Scene3d from '../../components/Scene3d/scene3d'
import { ActionTypes, IReducer, OpeDetailTypes } from '../../types'
import { randomBST, getLChildValue, getRChildValue, initSpheres, inOrderSeq, postOrderSeq, preOrderSeq, searchSeq } from './utils'
import { cdnOfNodes } from './config'
import { initState, IState, reducer } from './store'
import BSTCube3d from './BSTSphere3d/bstSphere3d'
import config from './config'
import './binarySearchTree.scss'
import { root } from '../../configs/router/config'

const { Step } = Steps;

const BinarySearchTree = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        const initBinaryTree = randomBST(config.geoNumRange, config.geoValueRange, config.maxDeepth);
        const treeToString = initBinaryTree.map((item) => {
            if (!item) return 'null'
            return item;
        }).toString();
        return {
            ...state,
            binaryTree: initBinaryTree,
            spheres: initSpheres(initBinaryTree),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString }]
        }
    });

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);



    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 添加元素 */
    const handleAddEle = (value: number, _: unknown) => {
        // console.log(value, index);
        // console.log(value);
        // let sequence: any[] = [];
        // searchSeq(state.binaryTree, value, 0, sequence);
        // console.log(sequence);
    }

    /** 删除元素 */
    const handleDeleteEle = () => {

    }

    /** 搜索元素 */
    const handleSearch = (value: number, _: unknown) => {
        // console.log(value, index);
        // console.log(value);
        let sequence: any[] = [];
        searchSeq(state.binaryTree, value, 0, sequence);
        console.log(sequence);
    }

    /** 随机生成数据 */
    const handleRandom = () => {
        dispatch({ type: ActionTypes.Random });
        setTimeout(() => {
            dispatch({ type: ActionTypes.RandomDone })
        }, config.animationSpeed);
    }

    /** 前序遍历 */
    const handlePreorder = () => {
        let sequence: any[] = [];
        preOrderSeq(state.binaryTree, 0, sequence);
        const preOrderRes: number[] = [];
        sequence.forEach((event) => {
            if (event.type === ActionTypes.Active) preOrderRes.push(state.binaryTree[event.index] as number)
        })
        dispatch({ type: ActionTypes.StartPreorder, payload: preOrderRes });
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.index })
            }, i * config.animationSpeed)
        })

    }

    /** 中序遍历 */
    const handleInorder = () => {
        let sequence: any[] = [];
        inOrderSeq(state.binaryTree, 0, sequence);
        const inOrderRes: number[] = [];
        sequence.forEach((event) => {
            if (event.type === ActionTypes.Active) inOrderRes.push(state.binaryTree[event.index] as number)
        })
        dispatch({ type: ActionTypes.StartInOrder, payload: inOrderRes });
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.index })
            }, i * config.animationSpeed)
        })
    }

    /** 后序遍历 */
    const handlePostorder = () => {
        let sequence: any[] = [];
        postOrderSeq(state.binaryTree, 0, sequence);
        const postOrderRes: number[] = [];
        sequence.forEach((event) => {
            if (event.type === ActionTypes.Active) postOrderRes.push(state.binaryTree[event.index] as number)
        })
        dispatch({ type: ActionTypes.StartPostOrder, payload: postOrderRes });
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.index })
            }, i * config.animationSpeed)
        })
    }

    return (
        <div className='binarySearchTree-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='二叉搜索树'
            />
            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {state.spheres.map((sphere, i) => {
                        // 判断当前结点是否有左孩子
                        const hasLChild = getLChildValue(state.spheres, i)?.value;

                        // 获取左结点的位置
                        const lChildPos = getLChildValue(cdnOfNodes, i);

                        // 判断当前结点是否有右孩子
                        const hasRChild = getRChildValue(state.spheres, i)?.value;

                        // 获取右结点的位置
                        const rChildPos = getRChildValue(cdnOfNodes, i);

                        return (
                            sphere.value &&
                            <BSTCube3d
                                key={'sphere' + i}
                                value={sphere.value}
                                position={cdnOfNodes[i]}
                                isActive={sphere.isActive}
                                activeLeft={sphere.activeLeft}
                                activeRight={sphere.activeRight}
                                isLock={sphere.isLock}
                                disappear={!state.randomDone}
                                lChildPos={hasLChild && lChildPos}
                                rChildPos={hasRChild && rChildPos}
                            />
                        )
                    })}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'inline-block' : 'none' }}
                    // onSliderChange={handleSliderChange}
                    isAddIndex={false}
                    isSearch={true}
                    onAdd={handleAddEle}
                    onDelete={handleDeleteEle}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>
                                <Button icon={<BarChartOutlined />} onClick={handlePreorder}>前序遍历</Button>
                                <Button icon={<BarChartOutlined />} onClick={handleInorder}>中序遍历</Button>
                                <Button icon={<BarChartOutlined />} onClick={handlePostorder}>后序遍历</Button>
                            </div>
                        </div>
                    }

                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item, i) => {
                                const { type, payload } = item;
                                switch (type) {
                                    case OpeDetailTypes.InOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`中序遍历: [${payload}]`}
                                            />
                                        )

                                    case OpeDetailTypes.PreOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`前序遍历: [${payload}]`}
                                            />
                                        )

                                    case OpeDetailTypes.PostOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`后序遍历: [${payload}]`}
                                            />
                                        )

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`当前二叉树: [${payload}]`}
                                            />
                                        )
                                }
                            })}
                        </Steps>
                    }
                >
                    <Item
                        key='item1'
                        icon={<DotChartOutlined />}
                        onClick={handleRandom}
                    >
                        随机生成
                    </Item>

                    <SubMenu
                        key='item2'
                        icon={<BarChartOutlined />}
                        title='遍历'
                    >
                        <Item onClick={handlePreorder}>前序遍历</Item>
                        <Item onClick={handleInorder}>中序遍历</Item>
                        <Item onClick={handlePostorder}>后序遍历</Item>
                    </SubMenu>
                </Console>

            </div>
        </div>
    )
}

export default BinarySearchTree;