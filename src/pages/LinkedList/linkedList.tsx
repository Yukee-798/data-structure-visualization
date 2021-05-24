import React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, InputNumber, PageHeader, Steps, message } from 'antd';
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import LinkCube3d from './LinkCube3d/linkCube3d'
import Scene3d from '../../components/Scene3d/scene3d';
import { randomArr, randomNum } from '../../utils/index'
import { ActionTypes, LINK_CUBE_INTERVAL_DISTANCE, IGeometryProps, OpeDetailTypes, DISPATCH_INTERVAL } from '../../types';
import {
    BarChartOutlined,
    DotChartOutlined,
} from '@ant-design/icons'; import './linkedList.scss'
import { getStartPosX, headInsertSeq, initCubes } from '../../utils/linkedList';

const { Step } = Steps;

export interface ILinkCube extends IGeometryProps {
    /** 该cube即将经历或者已经历过的所有位置 */
    sortIndexes: number[];
    /** 该cube的当前位置 */
    sortIndex: number;
    /** 从该cube开始，箭头指向的位置 */
    arrowTo: any;
    /** 是否让该元素上移 */
    moveTop: boolean;
    /** 元素的初始Y坐标 */
    posY: number;
    /** 是否让该元素下移 */
    moveDown: boolean;
}
type IReducer = (state: IState, action: IAction) => IState;

interface IState {
    // 用来表示数组中各值的实时位置
    values: number[];
    // 用来表示每个 cube 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    cubes: ILinkCube[];
    // 是否排序完毕
    sortDone: boolean;
    // 是否随机化完毕
    randomDone: boolean;
    // 第一个cube的起始x坐标
    startPosX: number;
    // 记录当前操作的细节
    opeDetails: { type: OpeDetailTypes, payload?: any }[]
}

interface IAction {
    type: ActionTypes;
    payload?: any;
}

const initState: IState = {
    values: [],
    cubes: [],
    sortDone: true,
    randomDone: true,
    startPosX: 0,
    opeDetails: []
}

function reducer(state: IState = initState, action: IAction): IState {

    const { type, payload } = action;


    switch (type) {
        case ActionTypes.Active:
            return {
                ...state,
            }

        case ActionTypes.Deactive:
            return {
                ...state,
            }

        case ActionTypes.HeadInsert:
            {
                // 生成一个激活的 cube
                const newCube: ILinkCube = {
                    arrowTo: null,
                    moveDown: false,
                    moveTop: true,
                    posY: 2,
                    sortIndex: 0,
                    sortIndexes: [0],
                    value: randomNum(3, 40),
                    isActive: true
                }

                const newCubes = state.cubes.map((item) => {
                    return {
                        ...item,
                        sortIndexes: [...item.sortIndexes, item.sortIndex + 1]
                    }
                })

                newCubes.push(newCube);

                let newOpeDetail;

                return {
                    ...state,
                    cubes: newCubes,
                    // opeDetails: newOpeDetail ? [...state.opeDetails, newOpeDetail] : [...state.opeDetails]
                }
            }

        // case ActionTypes.Add:

        // case ActionTypes.Delete:

        case ActionTypes.RandomDone:
            {
                let newValues = randomArr(randomNum(3, 5));
                let newStartPosX = getStartPosX(newValues.length);
                return {
                    ...state,
                    cubes: initCubes(newValues),
                    values: newValues,
                    randomDone: true,
                    startPosX: newStartPosX
                }
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false,
                opeDetails: []
            };

        // case ActionTypes.Search:

        default:
            return state;
    }
}

const LinkedList = () => {

    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {

        let initValues = randomArr(randomNum(3, 5));
        let startPosX = getStartPosX(initValues.length);
        return {
            ...state,
            values: initValues,
            cubes: initCubes(initValues),
            startPosX
        }
    })

    /** 控制台的添加删除元素的value和index */
    const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);

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
        }, 400);
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
                }, i * DISPATCH_INTERVAL)
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
                                    isSpRev={!state.randomDone}
                                    position={[state.startPosX + (item.sortIndex * LINK_CUBE_INTERVAL_DISTANCE), item.posY, 0]}
                                />
                                {i === 0 || i === arr.length - 1 ?
                                    <Text
                                        fillOpacity={state.randomDone ? 1 : 0}
                                        color='black'
                                        fontSize={0.5}
                                        position={[state.startPosX + (item.sortIndex * LINK_CUBE_INTERVAL_DISTANCE), -1, 0]}
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
                <Console
                    style={{ display: isSceneLoaded ? 'inline-block' : 'none' }}
                    onSliderChange={handleSliderChange}
                    operation={
                        <>
                            <div className='btn-group'>
                                <div className='row'>
                                    <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>
                                    <Button icon={<BarChartOutlined />} onClick={handleHeadInsert}>头插</Button>
                                    <Button icon={<BarChartOutlined />} onClick={handleTailInsert}>尾插</Button>
                                </div>
                            </div>

                            <div className='input-group'>
                                <label>
                                    <span className='lable-name'>数值:</span>
                                    <InputNumber onChange={(value) => setValue(value as number)} />
                                </label>
                                <label>
                                    <span className='lable-name'>序号:</span>
                                    <InputNumber onChange={(index) => setIndex(index as number)} />
                                </label>
                                <Button type='primary' onClick={handleAddEle}>添加</Button>
                                <Button onClick={handleDeleteEle}>删除</Button>
                            </div>
                        </>
                    }

                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item) => {
                                const { type, payload } = item;
                                switch (type) {
                                    case OpeDetailTypes.Swap:
                                        return (
                                            <Step
                                                title={`交换元素: i1=${payload.indexes[0]}, i2=${payload.indexes[1]}`}
                                                description={`当前数组: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Add:
                                        return (
                                            <Step
                                                title={`新增元素: i=${payload.index}, v=${payload.value}`}
                                                description={`当前数组: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Delete:
                                        return (
                                            <Step
                                                title={`删除元素: i=${payload.index}, v=${payload.value}`}
                                                description={`当前数组: [${payload.curValues.toString()}]`}
                                            />
                                        )
                                    default:
                                        return <></>
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
                        title='插入元素'
                    >
                        <Item onClick={handleHeadInsert}>头插</Item>
                        <Item onClick={handleTailInsert}>尾插</Item>
                    </SubMenu>
                </Console>
            </div>

        </div>
    )
}

export default LinkedList;