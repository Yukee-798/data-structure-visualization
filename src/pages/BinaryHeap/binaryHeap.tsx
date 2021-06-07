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
import { getLChildValue, getMaxDeepth, getRChildValue, initSeq, initSpheres, parseValue, treeToString } from '../../utils/binaryTree'
import { excuteSeq } from '../../utils'
import { addSeq, randomBh } from './utils'

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

    const handleRender = (value: string) => {
        const parseRes = parseValue(value);
        if (parseRes) {
            let sequence = initSeq(parseRes);
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning('输入的数据格式有误，请按照 "[1,3,8,2]" 类似格式输入')
        }
    }

    /** 添加元素 */
    const handleAddEle = (index: number, value: number) => {
        if (getMaxDeepth(state.values) === 4) {
            message.warning('添加失败，二叉堆最大层数为4')
        } else {
            let sequence = addSeq(state.values, value);
            excuteSeq(sequence, config.animationSpeed, dispatch)
        }
    }

    /** 随机生成数据 */
    const handleRandom = () => {
        let sequence = initSeq(randomBh(config.geoNumRange, config.geoValueRange));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** 处理动画速度改变 */
    const handleSliderChange = (x: number) => {
        config.animationSpeed = -7.95 * x + 1000
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
                    onSliderChange={handleSliderChange}
                    radioGroup={[1, 0, 0]}
                    onRender={handleRender}
                    addConfig={{
                        hasIndex: false,
                        hasValue: true,
                        radioName: '添加',
                        valueRange: config.geoValueRange
                    }}
                    onAdd={handleAddEle}
                    spinning={state.loading}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>

                            </div>
                        </div>
                    }

                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item, i) => {
                                const { type, payload } = item;
                                switch (type) {
                                    case OpeDetailTypes.Add: {
                                        const { value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`新增结点:  v=${value}`}
                                                description={`当前满二叉树: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    case OpeDetailTypes.Swap: {
                                        const { indexes, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`交换结点:  i=${indexes[0]}, v=${state.values[indexes[0]]} | i=${indexes[1]}, v=${state.values[indexes[1]]}`}
                                                description={`当前满二叉树: ${treeToString(cur)}`}
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
                </Console>

            </div>
        </div>
    )
}

export default BinaryHeap;