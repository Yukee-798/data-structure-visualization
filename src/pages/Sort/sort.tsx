import { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, InputNumber, PageHeader } from 'antd';
import { Map, List } from 'immutable'
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import SortCube3d from './SortCube3d/sortCube3d';
import Scene3d from '../../components/Scene3d/scene3d';
import { randomArr, randomNum } from '../../utils/index'
import { bubbleSortSeq, getStartXPos, initCubes, quickSortSeq, selectSortSeq } from '../../utils/sort';
import { ActionTypes, BASE_POSY, SORT_CUBE_INTERVAL_DISTANCE, DISPATCH_INTERVAL, IGeometryProps } from '../../types';
import {
    BarChartOutlined,
    DotChartOutlined,
} from '@ant-design/icons';
import './sort.scss'

export interface ISortCube extends IGeometryProps {
    strValue: string;
    sortIndex: number;
}
type IReducer = (state: IState, action: IAction) => IState;

interface IState {
    // 用来表示数组中各值的实时位置
    values: number[];
    // 表示当前正在交换的两个下标
    swapIndexes: [number, number] | [];
    // 用来表示每个 cube 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    cubes: ISortCube[];
    // 是否排序完毕
    sortDone: boolean;
    // 是否随机化完毕
    randomDone: boolean;
}

interface IAction {
    type: ActionTypes;
    payload?: number[];
}

const initState: IState = {
    values: [],
    cubes: [],
    swapIndexes: [],
    sortDone: true,
    randomDone: true,
}

function reducer(state: IState = initState, action: IAction): IState {

    const { type, payload } = action;

    state.cubes = List(state.cubes).toJS().map((item) => Map(item).toJS()) as ISortCube[];

    switch (type) {
        case ActionTypes.Active:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndex) ? { ...item, isActive: true } : { ...item }
                ),
                sortDone: false
            }

        case ActionTypes.Deactive:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndex) ? { ...item, isActive: false } : { ...item }
                )
            }

        case ActionTypes.Lock:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndex) ? { ...item, isLock: true } : { ...item }
                )
            }

        case ActionTypes.UnLock:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndex) ? { ...item, isLock: false } : { ...item }
                )
            }

        case ActionTypes.Swap:
            {
                // 取出需要交换的两个下标
                let index1 = (payload as number[])[0];
                let index2 = (payload as number[])[1];

                return {
                    ...state,
                    swapIndexes: [index1, index2]
                }
            }

        case ActionTypes.SwapDone:
            {
                // 取出需要交换的两个下标
                let index1 = (payload as number[])[0];
                let index2 = (payload as number[])[1];

                // 交换 values 的值
                let newValues = [...state.values];
                let temp = newValues[index1];
                newValues[index1] = newValues[index2];
                newValues[index2] = temp;

                // 交换 cubes 中对应下标的 sortIndex
                const newCubes: ISortCube[] = state.cubes.map((item) => {
                    if (item.sortIndex === index1) return { ...item, sortIndex: index2 }
                    else if (item.sortIndex === index2) return { ...item, sortIndex: index1 }
                    return { ...item };
                })
                return {
                    ...state,
                    cubes: newCubes,
                    swapIndexes: []
                }
            }

        case ActionTypes.SortDone:
            return {
                ...state,
                sortDone: true
            }

        // case ActionTypes.Add:

        // case ActionTypes.Delete:

        case ActionTypes.RandomDone:
            {
                let newValues = randomArr(randomNum(4, 10));
                return {
                    ...state,
                    cubes: initCubes(newValues),
                    values: newValues,
                    randomDone: true
                }
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            };

        // case ActionTypes.Search:

        default:
            return state;
    }
}

const Sort = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
        let initValues = randomArr(randomNum(4, 10));
        return {
            ...state,
            values: initValues,
            cubes: initCubes(initValues),
        }
    })

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 控制台的添加删除元素的value和index */
    const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);

    /** 传入数组长度，计算第一个元素的起始x坐标 */
    const startPosX = getStartXPos(state.cubes.length);

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

    /** 处理冒泡排序 */
    const handleBubbleSort = () => {
        let sequence = bubbleSortSeq(state.values);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.indexes })
            }, i * DISPATCH_INTERVAL);
        });
    }

    /** 处理选择排序 */
    const handleSelectSort = () => {
        let sequence = selectSortSeq(state.values);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.indexes })
            }, i * DISPATCH_INTERVAL)
        })
    }

    /** 处理快速排序 */
    const handleQuickSort = () => {
        let sequence: any[] = [];
        quickSortSeq([...state.values], 0, state.values.length - 1, sequence);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.indexes })
            }, i * DISPATCH_INTERVAL)
        })
    }

    const handleAddEle = () => {
        console.log(value, index);
    }

    const handleDeleteEle = () => {

    }

    return (
        <div className='sort-warp'>
            <PageHeader
                onBack={() => {
                    history.goBack();
                    window.location.reload();
                }}
                title='排序'
            />
            <div className='main'>
                <Scene3d onLoaded={handleSceneLoaded}>
                    {
                        state.cubes.map((item, index) => (
                            <SortCube3d
                                key={index + '@'}
                                sortIndex={item.sortIndex}
                                value={item.value}
                                startPosX={startPosX}
                                swapIndexes={state.swapIndexes}
                                isActive={item.isActive}
                                isLock={item.isLock}
                                // 由于 cube 的重心决定其位置，那么高度变化会导致其底部覆盖掉下面的 text，所以要改变其重心位置
                                position={[startPosX + (index * SORT_CUBE_INTERVAL_DISTANCE), ((item.value as number) * 0.2) / 2 + BASE_POSY, 0]}
                                isReset={!state.randomDone}
                            />
                        ))
                    }
                    {
                        state.cubes.map((_, index) => (
                            <Text
                                key={index + '*'}
                                fillOpacity={state.randomDone ? 1 : 0}
                                color='black'
                                fontSize={0.5}
                                position={[getStartXPos(state.cubes.length) + (index * SORT_CUBE_INTERVAL_DISTANCE), -1 + BASE_POSY, 0]}
                            >
                                {index}
                            </Text>
                        ))
                    }
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'inline-block' : 'none' }}
                    drawer={(
                        <>
                            <div className='operation'>

                                <div className='btn-group'>
                                    <div className='row'>
                                        <Button icon={<BarChartOutlined />}>随机生成</Button>
                                        <Button icon={<BarChartOutlined />}>冒泡排序</Button>
                                        <Button icon={<BarChartOutlined />}>选择排序</Button>
                                    </div>
                                    <div className='row'>
                                        <Button icon={<BarChartOutlined />}>插入排序</Button>
                                        <Button icon={<BarChartOutlined />}>快速排序</Button>
                                        <Button icon={<BarChartOutlined />}>归并排序</Button>
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
                            </div>

                            <div className='displayer'>
                                显示器
                            </div>
                        </>
                    )}
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
                        title='排序'
                    >
                        <Item onClick={handleBubbleSort}>冒泡排序</Item>
                        <Item onClick={handleSelectSort}>选择排序</Item>
                        <Item>插入排序</Item>
                        <Item onClick={handleQuickSort}>快速排序</Item>
                        <Item>归并排序</Item>
                    </SubMenu>
                </Console>
            </div>
        </div>
    )
}

export default Sort;