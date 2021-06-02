import React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps, message } from 'antd';
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons';
import Scene3d from '../../components/Scene3d/scene3d'
import StackCube3d from './StackCube3d/stackCube3d';
import { Text } from '@react-three/drei';
import { IReducer, OpeDetailTypes } from '../../types';
import { getStartYPos, initCubes, initSeq, parseValue, popSeq, pushSeq } from './utils';
import Console, { Item } from '../../components/Console/console';
import { IState, initState, reducer } from './store'
import config from './config'
import { root } from '../../configs/router/config';
import { excuteSeq, randomArr, randomNum } from '../../utils';


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

    /** 渲染器生成数组 */
    const handleRender = (value: string) => {
        const parseRes = parseValue(value);
        if (Array.isArray(parseRes)) {
            let sequence = initSeq(parseRes);
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning(parseRes)
        }
    }

    /** 处理弹栈 */
    const handlePop = () => {
        if (state.values.length > 0) {
            const sequence = popSeq();
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning('弹栈失败，当前栈为空')
        }

    }

    /** 处理压栈 */
    const handlePush = (value: number) => {
        if (state.values.length < config.geoNumRange[1] + 4) {
            const sequence = pushSeq(value);
            excuteSeq(sequence, config.animationSpeed, dispatch);
        } else {
            message.warning(`压栈失败，栈最大容量为${config.geoNumRange[1] + 4}`)
        }

    }

    /** 处理随机元素 */
    const handleRandom = () => {
        let sequence = initSeq(randomArr(randomNum(config.geoNumRange), config.geoValueRange));
        excuteSeq(sequence, config.animationSpeed, dispatch);
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
                                disappear={item.disappear}

                            />
                            {(i === state.cubes.length - 1 && !state.disappearAll) ?
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
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    showSilider={false}
                    onAdd={handlePush}
                    onDelete={handlePop}
                    valueRange={[0, 90]}
                    onRender={handleRender}
                    addText='压栈'
                    deleteText='弹栈'
                    isAddIndex={false}
                    isDeleteIndex={false}
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