import React, { useReducer, useState } from 'react'
import { useHistory } from 'react-router'
import { Text } from '@react-three/drei'
import { Button, PageHeader, Steps, message } from 'antd'
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons'
import Console, { Item, SubMenu } from '../../components/Console/console'
import Scene3d from '../../components/Scene3d/scene3d'
import { ActionTypes, IReducer, OpeDetailTypes } from '../../types'
import { cdnOfNodes } from './config'
import { initState, IState, reducer } from './store'
import BinaryHeapSphere3d from './BinaryHeapSphere3d/binaryHeapSphere3d'
import config from './config'
import { root } from '../../configs/router/config'
import { getLChildValue, getRChildValue, initSeq, initSpheres, treeToString } from '../../utils/binaryTree'
import { excuteSeq } from '../../utils'
import { randomBh } from './utils'

const { Step } = Steps;

const BinaryHeap = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            geometries: initSpheres(state.values),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString(state.values) }]
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
        dispatch({ type: ActionTypes.UnLock })
        // let sequence: any[] = [];

    }

    /** 删除元素 */
    const handleDeleteEle = (index: number) => {
        dispatch({ type: ActionTypes.UnLock })

        // 验证一下输入的序号
        if (!state.values[index]) {
            return message.warning('删除失败，输入的结点序号不存在')
        }

        // let sequence: any[] = [];


    }

    /** 搜索元素 */
    const handleSearch = (value: number) => {
        dispatch({ type: ActionTypes.UnLock })

        // let sequence: any[] = [];

    }

    /** 随机生成数据 */
    const handleRandom = () => {
        let sequence = initSeq(randomBh(config.geoNumRange, config.geoValueRange));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** 前序遍历 */
    const handlePreorder = () => {

    }

    /** 中序遍历 */
    const handleInorder = () => {

    }

    /** 后序遍历 */
    const handlePostorder = () => {

    }

    return (
        <div className='binaryHeap-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='二叉堆'
            />
            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {state.geometries.map((sphere, i) => {
                        // 判断当前结点是否有左孩子
                        const hasLChild = getLChildValue(state.geometries, sphere.sortIndex)?.value;

                        // 获取左结点的位置(加上前面的这个判断是为了在删除元素时，会设置与之连接的父结点的那条线为null)
                        const lChildPos = sphere.lChildPos !== null && getLChildValue(cdnOfNodes, sphere.sortIndex);

                        // 判断当前结点是否有右孩子
                        const hasRChild = sphere.rChildPos !== null && getRChildValue(state.geometries, sphere.sortIndex)?.value;

                        // 获取右结点的位置
                        const rChildPos = getRChildValue(cdnOfNodes, sphere.sortIndex);

                        return (
                            sphere.value && (
                                <React.Fragment key={'sphere' + i}>
                                    <BinaryHeapSphere3d
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
                                    case OpeDetailTypes.Add: {
                                        const { index, value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`新增结点: i=${index}, v=${value}`}
                                                description={`当前二叉堆: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    case OpeDetailTypes.Delete: {
                                        const { index, value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`删除结点: i=${index}, v=${value}`}
                                                description={`当前二叉堆: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`当前二叉堆: ${payload}`}
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

export default BinaryHeap;