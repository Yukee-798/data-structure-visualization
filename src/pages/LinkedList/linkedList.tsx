import React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps, message } from 'antd';
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import LinkCube3d from './LinkCube3d/linkCube3d'
import Scene3d from '../../components/Scene3d/scene3d';
import { randomArr, randomNum } from '../../utils/index'
import { ActionTypes, OpeDetailTypes, IReducer } from '../../types';
import {
    BarChartOutlined,
    DotChartOutlined,
} from '@ant-design/icons'; import './linkedList.scss'
import { getStartPosX, headInsertSeq, initCubes } from './utils';
import './config'
import config from '../Sort/config';
import { initState, IState, reducer } from './store';

const { Step } = Steps;

const LinkedList = () => {

    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {

        let initValues = randomArr(randomNum(config.geoNumRange), config.geoValueRange);
        let startPosX = getStartPosX(initValues.length);
        return {
            ...state,
            values: initValues,
            cubes: initCubes(initValues),
            startPosX
        }
    })

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 随机生成数据 */
    const handleRandom = () => {
        dispatch({ type: ActionTypes.Random });
        setTimeout(() => {
            dispatch({ type: ActionTypes.RandomDone })
        }, config.animationSpeed);
    }

    /** 处理动画速度改变 */
    const handleSliderChange = (value: number) => {
        // console.log(value);
    }

    /** 处理头插 */
    const handleHeadInsert = () => {
        if (state.values.length < 10) {
            const sequence = headInsertSeq();
            sequence.forEach((event, i) => {
                setTimeout(() => {
                    dispatch(event);
                }, i * config.animationSpeed)
            })
        } else {
            message.warning('插入失败，链表最大容量为10')
        }
    }

    /** 处理尾插 */
    const handleTailInsert = () => {
        if (state.values.length < 10) {

        } else {
            message.warning('插入失败，链表最大容量为10')
        }
    }

    /** 处理添加元素 */
    const handleAddEle = () => {

    }

    /** 处理删除元素 */
    const handleDeleteEle = () => {

    }

    return (
        <div className='linkedList-warp'>
            <PageHeader
                onBack={() => {
                    history.goBack();
                    window.location.reload();
                }}
                title='链表'
            />

            <div className='main'>
                <Scene3d onLoaded={handleSceneLoaded}>
                    {state.cubes.map((item, i, arr) => {
                        return (
                            <React.Fragment key={'linkCube' + i}>
                                <LinkCube3d
                                    moveTop={item.moveTop}
                                    moveDown={item.moveDown}
                                    arrowTo={item.arrowTo}
                                    sortIndex={item.sortIndex}
                                    sortIndexes={item.sortIndexes}
                                    startPosX={state.startPosX}
                                    value={item.value}
                                    isActive={item.isActive}
                                    isLock={item.isLock}
                                    disappear={!state.randomDone}
                                    position={[state.startPosX + (item.sortIndex * config.geoBaseDistance), item.posY, 0]}
                                />
                                {i === 0 || i === arr.length - 1 ?
                                    <Text
                                        fillOpacity={state.randomDone ? 1 : 0}
                                        color='black'
                                        fontSize={0.5}
                                        position={[state.startPosX + (item.sortIndex * config.geoBaseDistance), -1, 0]}
                                    >
                                        {i === 0 ? 'head' : 'tail'}
                                    </Text> : <></>
                                }
                            </React.Fragment>
                        )
                    })}
                    {/* <LinkCube3d
                        value={1}
                        position={[-3.5, 0, 0]}
                    />
                    <Arrow3d points={[[-2.5, 0, 0], [-1, 0, 0]]} />
                    <LinkCube3d
                        value={2}
                        position={[0, 0, 0]}
                    />
                    <Arrow3d points={[[1, 0, 0], [2.5, 0, 0]]} />
                    <LinkCube3d
                        value={3}
                        position={[3.5, 0, 0]}
                    />
                    <Arrow3d points={[[4.5, 0, 0], [6, 0, 0]]} />
                    <LinkCube3d
                        value={4}
                        position={[7, 0, 0]}
                    /> */}
                </Scene3d>
                {/* <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    onSliderChange={handleSliderChange}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>
                                <Button icon={<BarChartOutlined />} onClick={handleHeadInsert}>头插</Button>
                                <Button icon={<BarChartOutlined />} onClick={handleTailInsert}>尾插</Button>
                            </div>
                        </div>
                    }
                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item) => {
                                // const { type, payload } = item;
                                // switch (type) {
                                //     case OpeDetailTypes.Swap:
                                //         return (
                                //             <Step
                                //                 title={`交换元素: i1=${payload.indexes[0]}, i2=${payload.indexes[1]}`}
                                //                 description={`当前数组: [${payload.curValues.toString()}]`}
                                //             />
                                //         )

                                //     case OpeDetailTypes.Add:
                                //         return (
                                //             <Step
                                //                 title={`新增元素: i=${payload.index}, v=${payload.value}`}
                                //                 description={`当前数组: [${payload.curValues.toString()}]`}
                                //             />
                                //         )

                                //     case OpeDetailTypes.Delete:
                                //         return (
                                //             <Step
                                //                 title={`删除元素: i=${payload.index}, v=${payload.value}`}
                                //                 description={`当前数组: [${payload.curValues.toString()}]`}
                                //             />
                                //         )
                                //     default:
                                //         return <></>
                                // }
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
                        title='插入元素'
                    >
                        <Item onClick={handleHeadInsert}>头插</Item>
                        <Item onClick={handleTailInsert}>尾插</Item>
                    </SubMenu>
                </Console>
          */}
            </div>

        </div>
    )
}

export default LinkedList;