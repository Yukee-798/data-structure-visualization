import { useHistory } from 'react-router';
import { Button, InputNumber, PageHeader, Steps, message } from 'antd';
import Scene3d from '../../components/Scene3d/scene3d'
import StackCube3d from './StackCube3d/stackCube3d';
import React, { useReducer, useState } from 'react';
import { Text } from '@react-three/drei';
import { ActionTypes, DISPATCH_INTERVAL, IGeometryProps, OpeDetailTypes, STACK_CUBE_INTERVAL_DISTANCE } from '../../types';
import { getStartYPos, initCubes, popSeq, pushSeq } from '../../utils/stack';
import { randomArr, randomNum } from '../../utils';
import Console, { Item } from '../../components/Console/console';
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons';
import './stack.scss'

const { Step } = Steps;

export interface IStackCube extends IGeometryProps {

}

interface IState {
    cubes: IStackCube[];
    randomDone: boolean;
    opeDetails: { type: OpeDetailTypes, payload?: any }[]
    values: number[]
}

const initState: IState = {
    cubes: [],
    randomDone: true,
    opeDetails: [],
    values: randomArr(randomNum(4, 10))
}

interface IAction {
    type: ActionTypes;
    payload?: any;
}

type IReducer = (state: IState, action: IAction) => IState;

function reducer(state: IState = initState, action: IAction): IState {
    const { type, payload } = action;

    switch (type) {
        case ActionTypes.Active:
            {
                const newCubes: IStackCube[] = state.cubes.map((item, i, arr) => ({
                    ...item,
                    isActive: i === arr.length - 1
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }
        case ActionTypes.Deactive:
            {
                const newCubes: IStackCube[] = state.cubes.map((item, i, arr) => ({
                    ...item,
                    isActive: (i === arr.length - 1) ? false : item.isActive
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.Pop:
            {
                const newCubes: IStackCube[] = state.cubes.map((item, i, arr) => ({
                    ...item,
                    disappear: i === arr.length - 1
                }));

                const newValues = [...state.values];
                const popValue = newValues.pop();

                return {
                    ...state,
                    cubes: newCubes,
                    opeDetails: [...state.opeDetails, {
                        type: OpeDetailTypes.Pop,
                        payload: {
                            popValue,
                            curValues: newValues
                        }
                    }],
                    values: newValues
                }
            }

        case ActionTypes.PopDone:
            {
                const newCubes: IStackCube[] = [...state.cubes];
                newCubes.pop();
                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.Push:
            {
                const newCubes = [...state.cubes]
                const newCube: IStackCube = {
                    value: payload,
                    isActive: true
                };
                const newValues = [...state.values]
                newCubes.push(newCube);
                newValues.push(payload);

                return {
                    ...state,
                    cubes: newCubes,
                    values: newValues,
                    opeDetails: [...state.opeDetails, {
                        type: OpeDetailTypes.Push,
                        payload: {
                            pushValue: payload,
                            curValues: newValues
                        }
                    }]
                }
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            }

        case ActionTypes.RandomDone:
            {
                let newValues = randomArr(randomNum(4, 8));
                return {
                    ...state,
                    cubes: initCubes(newValues),
                    randomDone: true,
                    values: newValues,
                    opeDetails: [{ type: OpeDetailTypes.Default, payload: newValues }]
                }
            }

        default:
            return state;
    }
}

const Stack = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            cubes: initCubes(state.values),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: initState.values }]
        }
    });

    /** stackCube的起始坐标 */
    const startPosY = getStartYPos(state.cubes.length);

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 处理弹栈 */
    const handlePop = () => {
        if (state.values.length > 0) {
            const sequence = popSeq();
            sequence.forEach((event, i) => {
                setTimeout(() => {
                    dispatch(event)
                }, i * DISPATCH_INTERVAL)
            })
        } else {
            message.warning('弹栈失败，当前栈为空')
        }

    }

    /** 处理压栈 */
    const handlePush = (value: number) => {
        if (state.values.length < 10) {
            const sequence = pushSeq(value);
            sequence.forEach((event, i) => {
                setTimeout(() => {
                    dispatch(event)
                }, i * DISPATCH_INTERVAL)
            })
        } else {
            message.warning('压栈失败，栈最大容量为10')
        }

    }

    /** 处理随机元素 */
    const handleRandom = () => {
        dispatch({ type: ActionTypes.Random });
        setTimeout(() => {
            dispatch({ type: ActionTypes.RandomDone })
        }, 400)
    }

    return (
        <div className='stack-warp'>
            <PageHeader
                onBack={() => {
                    history.replace('/data-structure-visualization/')
                    window.location.reload();
                }}
                title='栈'
            />
            <div className='main'>
                <Scene3d onLoaded={handleSceneLoaded}>
                    {state.cubes.map((item, i) => (
                        <React.Fragment key={i + '!'}>
                            <StackCube3d
                                value={item.value}
                                position={[0, startPosY + (i * STACK_CUBE_INTERVAL_DISTANCE) + 2, 0]}
                                isSpRev={!state.randomDone}
                                isActive={item.isActive}
                                disappear={item.disappear}

                            />
                            {(i === state.cubes.length - 1 && state.randomDone) ?
                                <Text
                                    fontSize={0.5}
                                    color='black'
                                    position={[-2.5, startPosY + (i * STACK_CUBE_INTERVAL_DISTANCE) + 2, 0]}
                                >
                                    {'Top ——>'}
                                </Text> : <></>}
                        </React.Fragment>
                    ))}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'inline-block' : 'none' }}
                    showSilider={false}
                    onAdd={handlePush}
                    onDelete={handlePop}
                    valueRange={[0, 90]}
                    addText='压栈'
                    deleteText='弹栈'
                    isIndex={false}
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
                                    case OpeDetailTypes.Pop:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`弹栈: v=${payload.popValue}`}
                                                description={`当前栈: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Push:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`压栈: v=${payload.pushValue}`}
                                                description={`当前栈: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`当前栈: [${payload.toString()}]`}
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

export default Stack;