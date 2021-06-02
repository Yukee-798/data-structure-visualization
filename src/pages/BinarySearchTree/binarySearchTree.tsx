import React, { useReducer, useState } from 'react'
import { useHistory } from 'react-router'
import { Text } from '@react-three/drei'
import { Button, PageHeader, Steps, message } from 'antd'
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons'
import Console, { Item, SubMenu } from '../../components/Console/console'
import Scene3d from '../../components/Scene3d/scene3d'
import { ActionTypes, IAction, IReducer, OpeDetailTypes, SeqType } from '../../types'
import { cdnOfNodes } from './config'
import { initState, IState, reducer } from './store'
import BSTSphere3d from './BSTSphere3d/bstSphere3d'
import { root } from '../../configs/router/config'
import { addNodeSeq, deleteNodeSeq, randomBST, searchSeq } from './utils'
import { getDeepthByNodeIndex, getLChildValue, getRChildValue, initSeq, initSpheres, inOrderSeq, parseValue, postOrderSeq, preOrderSeq, treeToString } from '../../utils/binaryTree'
import config from './config'
import { excuteSeq } from '../../utils'

const { Step } = Steps;

const BinarySearchTree = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            spheres: initSpheres(initState.binaryTree),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString(initState.binaryTree) }]
        }
    });

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 渲染input输入的数据 */
    const handleRender = (value: string) => {
        const parseRes = parseValue(value);
        console.log(parseRes);
        if (parseRes) {
            let sequence = initSeq(parseRes);
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning('输入的数据格式有误，请按照 "[1,3,8,2]" 类似格式输入')
        }
    }

    // [32,27,56,n,n,54,n,n,n,n,n,n,55]
    /** 添加元素 */
    const handleAddEle = (value: number, _: unknown) => {
        dispatch({ type: ActionTypes.UnLock })
        let sequence: any[] = [];
        addNodeSeq(state.binaryTree, 0, value, sequence);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                if (event.type !== ActionTypes.Add) {
                    dispatch(event)
                } else {
                    // 判断一下最后要添加的元素的下标对应的层数是不是小于等于配置项的最大层数
                    if (getDeepthByNodeIndex(event.payload.index) <= config.maxDeepth) {
                        dispatch(event)
                    } else {
                        message.warning(`添加失败，二叉树最大层数为${config.maxDeepth + 1}`)
                    }
                }
            }, i * config.animationSpeed)
        })
    }

    /** 删除元素 */
    const handleDeleteEle = (index: number) => {
        dispatch({ type: ActionTypes.UnLock })

        // 验证一下输入的序号
        if (!state.binaryTree[index]) {
            return message.warning('删除失败，输入的结点序号不存在')
        }

        let sequence: any[] = [];
        deleteNodeSeq(state.binaryTree, index, 0, sequence);
        console.log(sequence);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch(event)
            }, i * config.animationSpeed)
        })

    }

    /** 搜索元素 */
    const handleSearch = (value: number) => {
        dispatch({ type: ActionTypes.UnLock })

        let sequence: SeqType = [];
        searchSeq(state.binaryTree, value, 0, sequence);
        excuteSeq(sequence, config.animationSpeed, dispatch);

        // 如果最后一个操作的下标对应的值不等于value，则说明没有查找到目标元素
        if (state.binaryTree[([...sequence].pop() as IAction[])[0].payload] !== value) {
            setTimeout(() => {
                message.warning(`没有查找到取值为 ${value} 的元素`);
            }, (sequence.length) * config.animationSpeed)
        }
    }

    /** 处理随机元素 */
    const handleRandom = () => {
        let sequence = initSeq(randomBST(config.geoNumRange, config.geoValueRange, config.maxDeepth));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** 前序遍历 */
    const handlePreorder = () => {

        let sequence: SeqType = [];
        preOrderSeq(state.binaryTree, 0, sequence);

        // 获取遍历的结果
        const preOrderRes: number[] = [];
        sequence.forEach((event) => {
            if (event[0].type === ActionTypes.Active) preOrderRes.push(state.binaryTree[event[0].payload] as number)
        })

        dispatch({ type: ActionTypes.StartPreorder, payload: preOrderRes });
        excuteSeq(sequence, config.animationSpeed, dispatch);

    }

    /** 中序遍历 */
    const handleInorder = () => {
        let sequence: SeqType = [];
        inOrderSeq(state.binaryTree, 0, sequence);

        // 获取遍历的结果
        const inOrderRes: number[] = [];
        sequence.forEach((events) => {
            if (events[0].type === ActionTypes.Active) inOrderRes.push(state.binaryTree[events[0].payload] as number)
        })

        dispatch({ type: ActionTypes.StartInOrder, payload: inOrderRes });
        excuteSeq(sequence, config.animationSpeed, dispatch);

    }

    /** 后序遍历 */
    const handlePostorder = () => {
        let sequence: SeqType = [];
        postOrderSeq(state.binaryTree, 0, sequence);
        const postOrderRes: number[] = [];
        sequence.forEach((events) => {
            if (events[0].type === ActionTypes.Active) postOrderRes.push(state.binaryTree[events[0].payload] as number)
        })
        dispatch({ type: ActionTypes.StartPostOrder, payload: postOrderRes });
        excuteSeq(sequence, config.animationSpeed, dispatch);
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
                        const hasLChild = getLChildValue(state.spheres, sphere.sortIndex)?.value;

                        // 获取左结点的位置(加上前面的这个判断是为了在删除元素时，会设置与之连接的父结点的那条线为null)
                        const lChildPos = sphere.lChildPos !== null && getLChildValue(cdnOfNodes, sphere.sortIndex);

                        // 判断当前结点是否有右孩子
                        const hasRChild = sphere.rChildPos !== null && getRChildValue(state.spheres, sphere.sortIndex)?.value;

                        // 获取右结点的位置
                        const rChildPos = getRChildValue(cdnOfNodes, sphere.sortIndex);

                        return (
                            sphere.value && (
                                <React.Fragment key={'sphere' + i}>
                                    <BSTSphere3d
                                        value={sphere.value}
                                        sortIndex={sphere.sortIndex}
                                        sortIndexes={sphere.sortIndexes}
                                        position={cdnOfNodes[sphere.sortIndex]}
                                        isActive={sphere.isActive}
                                        activeLeft={sphere.activeLeft}
                                        activeRight={sphere.activeRight}
                                        isLock={sphere.isLock}
                                        disappear={sphere.disappear}
                                        lChildPos={hasLChild && lChildPos}
                                        rChildPos={hasRChild && rChildPos}
                                    />
                                    <Text
                                        position={[cdnOfNodes[i][0], cdnOfNodes[i][1] - 1.2, cdnOfNodes[i][2]]}
                                        fontSize={0.4}
                                        fillOpacity={!sphere.disappear && !state.disappearAll ? 1 : 0}
                                        color='black'
                                    >
                                        {i}
                                    </Text>
                                </React.Fragment>

                            )
                        )
                    })}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    // onSliderChange={handleSliderChange}
                    isAddIndex={false}
                    isSearch={true}
                    onAdd={handleAddEle}
                    onDelete={handleDeleteEle}
                    onSearch={handleSearch}
                    onRender={handleRender}
                    spinning={state.loading}
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

                                    case OpeDetailTypes.Add: {
                                        const { index, value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`新增结点: i=${index}, v=${value}`}
                                                description={`当前二叉树: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    case OpeDetailTypes.Delete: {
                                        const { index, value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`删除结点: i=${index}, v=${value}`}
                                                description={`当前二叉树: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`当前二叉树: ${payload}`}
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