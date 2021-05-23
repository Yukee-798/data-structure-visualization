import { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, InputNumber, PageHeader, Steps } from 'antd';
import { Map, List } from 'immutable'
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import SortCube3d from './SortCube3d/sortCube3d';
import Scene3d from '../../components/Scene3d/scene3d';
import { randomArr, randomNum } from '../../utils/index'
import { addEleSeq, bubbleSortSeq, deleteEleSeq, getStartPosX, initCubes, quickSortSeq, selectSortSeq } from '../../utils/sort';
import { ActionTypes, BASE_POSY, SORT_CUBE_INTERVAL_DISTANCE, DISPATCH_INTERVAL, IGeometryProps, OpeDetailTypes } from '../../types';
import {
    BarChartOutlined,
    DotChartOutlined,
} from '@ant-design/icons';
import './sort.scss'

const { Step } = Steps;

export interface ISortCube extends IGeometryProps {
    // 记录 cube 将要经历或者已经历过的下标
    sortIndexes: number[];
    // 记录 cube 当前页面中正处于的下标
    sortIndex: number;
}
type IReducer = (state: IState, action: IAction) => IState;

interface IState {
    // 用来表示数组中各值的实时位置
    values: number[];
    // 用来表示每个 cube 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    cubes: ISortCube[];
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
    state.cubes = List(state.cubes).toJS().map((item) => Map(item).toJS()) as ISortCube[];

    switch (type) {
        case ActionTypes.Active:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => (payload?.includes(item.sortIndexes[item.sortIndexes.length - 1]) ? { ...item, isActive: true } : { ...item })
                ),
                sortDone: false
            }

        case ActionTypes.Deactive:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndexes[item.sortIndexes.length - 1]) ? { ...item, isActive: false } : { ...item }
                )
            }

        case ActionTypes.Lock:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndexes[item.sortIndexes.length - 1]) ? { ...item, isLock: true } : { ...item }
                )
            }

        case ActionTypes.UnLock:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndexes[item.sortIndexes.length - 1]) ? { ...item, isLock: false } : { ...item }
                )
            }

        case ActionTypes.Swap:
            {

                // 取出需要交换的两个下标
                // 取出需要交换的两个下标
                let index1 = (payload as number[])[0];
                let index2 = (payload as number[])[1];

                // 向 cube 对应的 sortIndexes 中 push 新的下标
                const newCubes: ISortCube[] = state.cubes.map((item) => {
                    const curSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                    if (curSortIndex === index1) {
                        const newSortIndexes = [...item.sortIndexes, index2]
                        return { ...item, sortIndexes: newSortIndexes }
                    } else if (curSortIndex === index2) {
                        const newSortIndexes = [...item.sortIndexes, index1]
                        return { ...item, sortIndexes: newSortIndexes }
                    }
                    return { ...item };
                })

                // 交换 values 的值
                let newValues = [...state.values];
                let temp = newValues[index1];
                newValues[index1] = newValues[index2];
                newValues[index2] = temp;

                const newOpeDetail = {
                    type: OpeDetailTypes.Swap,
                    payload: {
                        indexes: [index1, index2],
                        curValues: [...newValues]
                    }
                }

                return {
                    ...state,
                    cubes: newCubes,
                    opeDetails: [...state.opeDetails, newOpeDetail],
                    values: newValues
                }
            }

        case ActionTypes.SwapDone:
            {

                // 交换完毕后，将对应的cube的sortIndex改为最新的sortIndex
                const newCubes: ISortCube[] = state.cubes.map((item) => {
                    const newSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                    if (item.sortIndex !== newSortIndex) return { ...item, sortIndex: newSortIndex }
                    return { ...item }
                })

                return {
                    ...state,
                    cubes: newCubes,
                }
            }

        case ActionTypes.SortDone:
            return {
                ...state,
                sortDone: true
            }

        case ActionTypes.Move:
            {
                const { oldIndexes, targetIndexes }: { oldIndexes: number[], targetIndexes: number[] } = payload;
                // 把包含在 oldIndexes 中的 sortIndex 找出来
                const newCubes = state.cubes.map((item) => {
                    // 看 sortIndex 在 oldIndexes 中处于哪个位置，也对应 targetIndexes 的位置
                    let i = oldIndexes.findIndex((value) => value === item.sortIndex);
                    // 如果找到了，则往 sortIndexes 中添加 targetIndexes[i]
                    if (i >= 0) {
                        return {
                            ...item,
                            sortIndexes: [...item.sortIndexes, targetIndexes[i]]
                        }
                    }
                    return { ...item }
                })


                let newValues: number[] = [...state.values];

                let newOpeDetail;

                // 判断是扩容还是缩容
                if (targetIndexes[0] > oldIndexes[0]) {
                    // 扩容下标
                    newValues.push(-1);
                } else {
                    // 缩容下标
                    newValues.splice(oldIndexes[0], 1);
                    newOpeDetail = { type: OpeDetailTypes.Delete, payload: { index: oldIndexes[0], value: state.values[oldIndexes[0]], curValues: [...newValues] } }
                }

                return {
                    ...state,
                    cubes: newCubes,
                    values: newValues,
                    opeDetails: newOpeDetail ? [...state.opeDetails, newOpeDetail] : [...state.opeDetails]
                }
            }

        case ActionTypes.AddDone:
            {
                const { newEle, targetIndex } = payload;

                // 生成新 cube
                const newCube: ISortCube = {
                    sortIndex: targetIndex,
                    sortIndexes: [targetIndex],
                    value: newEle
                }

                // 更新 cube 的 sortIndex 到最新
                let newCubes = state.cubes.map((item, i) => {
                    const curSortIndex = item.sortIndex;
                    const newSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                    if (curSortIndex !== newSortIndex) {
                        return { ...item, sortIndex: newSortIndex };
                    }
                    return { ...item };
                })

                // 添加新 cube
                newCubes.push(newCube);

                // 更新 values
                let newValues = [...state.values];
                newValues.splice(targetIndex, 0, newEle);
                newValues.pop();

                const newOpeDetail = { type: OpeDetailTypes.Add, payload: { index: targetIndex, value: newEle, curValues: [...newValues] } }

                return {
                    ...state,
                    cubes: newCubes,
                    values: newValues,
                    opeDetails: [...state.opeDetails, newOpeDetail]
                }
            }

        case ActionTypes.Delete:
            {
                const newCubes = state.cubes.map((item) => item.sortIndex === payload ? { ...item, disappear: true } : { ...item });

                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.DeleteDone:
            {

                let newCubes = [...state.cubes];

                // 先把删除的元素真正意义上从 cubes 中删除
                newCubes.splice(payload, 1);

                // 更新 cube 的 sortIndex 到最新
                newCubes = state.cubes.map((item) => {
                    const curSortIndex = item.sortIndex;
                    const newSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                    if (curSortIndex !== newSortIndex) {
                        return { ...item, sortIndex: newSortIndex };
                    }
                    return { ...item };
                })

                return {
                    ...state,
                    cubes: newCubes
                }

            }

        case ActionTypes.RandomDone:
            {
                let newValues = randomArr(randomNum(4, 8));
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

        default:
            return state;
    }
}

const Sort = () => {
    const history = useHistory();

    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
        let initValues = randomArr(randomNum(4, 10));
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

    /** 控制台的添加删除元素的value和index */
    const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);

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

    /** 处理添加元素 */
    const handleAddEle = () => {
        const sequence = addEleSeq(state.values, value, index);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.payload })
            }, i * DISPATCH_INTERVAL)
        })
    }

    /** 处理删除元素 */
    const handleDeleteEle = () => {
        const sequence = deleteEleSeq(state.values, index);
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.payload })
            }, i * DISPATCH_INTERVAL)
        })
    }

    /** 处理动画速度改变 */
    const handleSliderChange = (value: number) => {
        // console.log(value);
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
                                sortIndexes={item.sortIndexes}
                                sortIndex={item.sortIndex}
                                value={item.value}
                                startPosX={state.startPosX}
                                isActive={item.isActive}
                                isLock={item.isLock}
                                // 由于 cube 的重心决定其位置，那么高度变化会导致其底部覆盖掉下面的 text，所以要改变其重心位置
                                position={[state.startPosX + (item.sortIndex * SORT_CUBE_INTERVAL_DISTANCE), ((item.value as number) * 0.2) / 2 + BASE_POSY, 0]}
                                isReset={!state.randomDone}
                                disappear={item.disappear}
                            />
                        ))
                    }
                    {
                        state.values.map((_, index) => (
                            <Text
                                key={index + '*'}
                                fillOpacity={state.randomDone ? 1 : 0}
                                color='black'
                                fontSize={0.5}
                                position={[state.startPosX + (index * SORT_CUBE_INTERVAL_DISTANCE), -1 + BASE_POSY, 0]}
                            >
                                {index}
                            </Text>
                        ))
                    }
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'inline-block' : 'none' }}
                    onSliderChange={handleSliderChange}
                    operation={
                        <>
                            <div className='btn-group'>
                                <div className='row'>
                                    <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>
                                    <Button icon={<BarChartOutlined />} onClick={handleBubbleSort}>冒泡排序</Button>
                                    <Button icon={<BarChartOutlined />} onClick={handleSelectSort}>选择排序</Button>
                                </div>
                                <div className='row'>
                                    <Button icon={<BarChartOutlined />}>插入排序</Button>
                                    <Button icon={<BarChartOutlined />} onClick={handleQuickSort}>快速排序</Button>
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