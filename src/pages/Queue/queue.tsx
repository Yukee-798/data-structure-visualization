import React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, InputNumber, PageHeader, Steps, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { Text } from '@react-three/drei';
import Console, { Item } from '../../components/Console/console';
import Scene3d from '../../components/Scene3d/scene3d';
import QueueCube3d from './QueueCube3d/queueCube3d'
import { randomArr, randomNum } from '../../utils/index'
import { ActionTypes, DISPATCH_INTERVAL, IGeometryProps, OpeDetailTypes, QUEUE_CUBE_INTERVAL_DISTANCE } from '../../types';
import {
    BarChartOutlined,
    DotChartOutlined
} from '@ant-design/icons';
import './queue.scss'
import { dequeueSeq, enqueueSeq, getStartPosX, initCubes } from '../../utils/queue';

const { Step } = Steps;

export interface IQueueCube extends IGeometryProps {
    key: any;
}
type IReducer = (state: IState, action: IAction) => IState;

interface IState {
    values: number[];
    cubes: IQueueCube[];
    randomDone: boolean;
    opeDetails: { type: OpeDetailTypes, payload?: any }[]
}

interface IAction {
    type: ActionTypes;
    payload?: any;
}

const initState: IState = {
    randomDone: true,
    values: randomArr(randomNum(3, 6)),
    cubes: [],
    opeDetails: []
}

function reducer(state: IState = initState, action: IAction): IState {

    const { type, payload } = action;

    switch (type) {
        case ActionTypes.Active:
            {
                const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                    ...item,
                    isActive: i === payload
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }
        case ActionTypes.Deactive:
            {
                const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                    ...item,
                    isActive: i === payload ? false : item.isActive
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.Disappear:
            {
                const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                    ...item,
                    disappear: i === payload
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.Enqueue:
            {
                const newCubes = [...state.cubes]
                const newCube: IQueueCube = {
                    value: payload,
                    isActive: true,
                    key: uuidv4()
                };
                const newValues = [...state.values]
                newCubes.push(newCube);
                newValues.push(payload);

                return {
                    ...state,
                    cubes: newCubes,
                    values: newValues,
                    opeDetails: [...state.opeDetails, {
                        type: OpeDetailTypes.Enqueue,
                        payload: {
                            enqueueValue: payload,
                            curValues: newValues
                        }
                    }]
                }
            }

        case ActionTypes.Dequeue:
            {
                const newCubes: IQueueCube[] = [...state.cubes];
                newCubes.shift();
                const newValues = [...state.values];
                const dequeueValue = newValues.shift();

                return {
                    ...state,
                    opeDetails: [...state.opeDetails, {
                        type: OpeDetailTypes.Dequeue,
                        payload: {
                            dequeueValue,
                            curValues: newValues
                        }
                    }],
                    values: newValues,
                    cubes: newCubes
                }
            }

        case ActionTypes.RandomDone:
            {
                let newValues = randomArr(randomNum(3, 6));
                return {
                    ...state,
                    cubes: initCubes(newValues),
                    randomDone: true,
                    values: newValues,
                    opeDetails: [{ type: OpeDetailTypes.Default, payload: newValues }]
                }
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            };

        default:
            return state;
    }
}

const Queue = () => {

    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            cubes: initCubes(state.values),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: initState.values }]
        }
    });

    /** 控制台的添加删除元素的value和index */
    const [value, setValue] = useState(0);

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 传入数组长度，计算第一个元素的起始x坐标 */
    const startPosX = getStartPosX(state.cubes.length);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 随机生成队列 */
    const handleRandom = () => {
        dispatch({ type: ActionTypes.Random });
        setTimeout(() => {
            dispatch({ type: ActionTypes.RandomDone })
        }, 400);
    }

    /** 处理入队 */
    const handleEnqueue = () => {
        if (state.values.length < 10) {
            const sequence = enqueueSeq(value, state.values.length);
            sequence.forEach((event, i) => {
                setTimeout(() => {
                    dispatch(event)
                }, i * DISPATCH_INTERVAL)
            })
        } else {
            message.warning('入队失败，队列最大容量为10')
        }
    }

    /** 处理出队 */
    const handleDequeue = () => {
        if (state.values.length > 0) {
            const sequence = dequeueSeq();
            sequence.forEach((event, i) => {
                setTimeout(() => {
                    dispatch(event)
                }, i * DISPATCH_INTERVAL)
            })
        } else {
            message.warning('出队失败，当前队列为空')
        }

    }
    return (
        <div className='queue-warp'>
            <PageHeader
                onBack={() => {
                    history.goBack();
                    window.location.reload();
                }}
                title='队列'
            />

            <div className='main'>
                <Scene3d onLoaded={handleSceneLoaded}>
                    {state.cubes.map((item, i, arr) => (
                        <React.Fragment key={item.key}>
                            <QueueCube3d
                                value={item.value}
                                position={[startPosX + (i * QUEUE_CUBE_INTERVAL_DISTANCE), 0, 0]}
                                isSpRev={!state.randomDone}
                                isActive={item.isActive}
                                disappear={item.disappear}
                            />
                            {i === 0 || i === arr.length - 1 ?
                                <Text
                                    fillOpacity={state.randomDone ? 1 : 0}
                                    color='black'
                                    fontSize={0.5}
                                    position={[startPosX + (i * QUEUE_CUBE_INTERVAL_DISTANCE), -1, 0]}
                                >
                                    {i === 0 ? 'head' : 'tail'}
                                </Text> : <></>
                            }
                        </React.Fragment>
                    ))}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'inline-block' : 'none' }}
                    showSilider={false}
                    operation={
                        <>
                            <div className='btn-group'>
                                <div className='row'>
                                    <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>
                                </div>
                            </div>

                            <div className='input-group'>
                                <label>
                                    <span className='lable-name'>数值:</span>
                                    <InputNumber onChange={(value) => setValue(value as number)} />
                                </label>
                                <Button type='primary' onClick={handleEnqueue}>入队</Button>
                                <Button onClick={handleDequeue}>出队</Button>
                            </div>
                        </>
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