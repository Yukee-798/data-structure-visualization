import React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps, message } from 'antd';
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons';
import Scene3d from '../../components/Scene3d/scene3d'
import StackCube3d from './StackCube3d/stackCube3d';
import { Text } from '@react-three/drei';
import { ActionTypes, IReducer, OpeDetailTypes } from '../../types';
import { getStartYPos, initCubes, popSeq, pushSeq } from './utils';
import Console, { Item } from '../../components/Console/console';
import { IState, initState, reducer } from './store'
import config from './config'
import './stack.scss'
import { root } from '../../configs/router/config';

const { Step } = Steps;


const Stack = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
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
                }, i * config.animationSpeed)
            })
        } else {
            message.warning('弹栈失败，当前栈为空')
        }

    }

    /** 处理压栈 */
    const handlePush = (value: number) => {
        if (state.values.length < config.geoNumRange[1]) {
            const sequence = pushSeq(value);
            sequence.forEach((event, i) => {
                setTimeout(() => {
                    dispatch(event)
                }, i * config.animationSpeed)
            })
        } else {
            message.warning(`压栈失败，栈最大容量为${config.geoNumRange[1]}`)
        }

    }

    /** 处理随机元素 */
    const handleRandom = () => {
        dispatch({ type: ActionTypes.Random });
        setTimeout(() => {
            dispatch({ type: ActionTypes.RandomDone })
        }, config.animationSpeed)
    }

    return (
        <div className='stack-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='栈'
            />
            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {state.cubes.map((item, i) => (
                        <React.Fragment key={i + '!'}>
                            <StackCube3d
                                value={item.value}
                                position={[0, startPosY + (i * config.geoBaseDistance) + config.geoBasePosY, 0]}
                                isActive={item.isActive}
                                disappear={item.disappear || !state.randomDone}

                            />
                            {(i === state.cubes.length - 1 && state.randomDone) ?
                                <Text
                                    fontSize={0.5}
                                    color='black'
                                    position={[-2.5, startPosY + (i * config.geoBaseDistance) + config.geoBasePosY, 0]}
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
                    isAddIndex={false}
                    isDeleteIndex={false}
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