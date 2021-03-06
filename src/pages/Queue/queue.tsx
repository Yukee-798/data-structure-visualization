import React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps, message } from 'antd';
import { Text } from '@react-three/drei';
import Console, { Item } from '../../components/Console/console';
import Scene3d from '../../components/Scene3d/scene3d';
import QueueCube3d from './QueueCube3d/queueCube3d'
import { IReducer, OpeDetailTypes } from '../../types';
import {
    BarChartOutlined,
    DotChartOutlined
} from '@ant-design/icons';
import { dequeueSeq, enqueueSeq, getStartPosX, initCubes, initSeq } from './utils';
import { initState, IState, reducer } from './store';
import config from './config'
import { root } from '../../configs/router/config';
import { excuteSeq, randomArr, randomNum } from '../../utils';

const { Step } = Steps;

const Queue = () => {

    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            cubes: initCubes(state.values),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: initState.values }]
        }
    });

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 传入数组长度，计算第一个元素的起始x坐标 */
    const startPosX = getStartPosX(state.cubes.length);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 处理随机元素 */
    const handleRandom = () => {
        let sequence = initSeq(randomArr(randomNum(config.geoNumRange), config.geoValueRange));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** 处理入队 */
    const handleEnqueue = (index: number, value: number) => {
        if (state.values.length < config.geoNumRange[1] + 5) {
            const sequence = enqueueSeq(value, state.values.length);
            excuteSeq(sequence, config.animationSpeed, dispatch);

        } else {
            message.warning(`入队失败，队列最大容量为${config.geoNumRange[1] + 5}`)
        }
    }

    /** 处理出队 */
    const handleDequeue = () => {
        if (state.values.length > 0) {
            const sequence = dequeueSeq();
            excuteSeq(sequence, config.animationSpeed, dispatch);

        } else {
            message.warning('出队失败，当前队列为空')
        }

    }
    return (
        <div className='queue-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='队列'
            />

            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {state.cubes.map((item, i, arr) => (
                        <React.Fragment key={item.key}>
                            <QueueCube3d
                                value={item.value}
                                position={[startPosX + (i * config.geoBaseDistance), config.geoBasePosY, 0]}
                                isActive={item.isActive}
                                disappear={item.disappear}
                            />
                            {i === 0 || i === arr.length - 1 ?
                                <Text
                                    fillOpacity={!state.disappearAll ? 1 : 0}
                                    color='black'
                                    fontSize={0.5}
                                    position={[startPosX + (i * config.geoBaseDistance), config.geoBasePosY - 1, 0]}
                                >
                                    {i === 0 ? 'head' : 'tail'}
                                </Text> : <></>
                            }
                        </React.Fragment>
                    ))}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    radioGroup={[1, 1, 0]}
                    addConfig={{
                        hasIndex: false,
                        hasValue: true,
                        valueRange: config.geoValueRange,
                        radioName: '入队'
                    }}
                    deleteConfig={{
                        hasIndex: false,
                        hasValue: false,
                        radioName: '出队'
                    }}
                    showSilider={false}
                    onAdd={handleEnqueue}
                    onDelete={handleDequeue}
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
                                    case OpeDetailTypes.Enqueue:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`入队: v=${payload.enqueueValue}`}
                                                description={`当前队列: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Dequeue:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`出队: v=${payload.dequeueValue}`}
                                                description={`当前队列: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`当前队列: [${payload.toString()}]`}
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

export default Queue;