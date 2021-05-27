import { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps, message } from 'antd';
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons';
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import SortCube3d from './SortCube3d/sortCube3d';
import Scene3d from '../../components/Scene3d/scene3d';
import { addEleSeq, bubbleSortSeq, deleteEleSeq, getStartPosX, initCubes, quickSortSeq, selectSortSeq } from '../../utils/sort';
import { ActionTypes, BASE_POSY, SORT_CUBE_INTERVAL_DISTANCE, DISPATCH_INTERVAL, OpeDetailTypes, IReducer } from '../../types';
import { initState, IState, reducer } from './store';
import './sort.scss'

const { Step } = Steps;

const Sort = () => {
    const history = useHistory();

    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
            cubes: initCubes(state.values),
            startPosX: getStartPosX(state.values.length),
            opeDetails: [{ type: OpeDetailTypes.Default, payload: initState.values }]
        }
    })

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 随机生成数组 */
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
    const handleAddEle = (value: number, index: number) => {
        if (state.values.length < 10) {
            if (index > state.values.length) {
                message.warning('输入的序号不合法')
            } else {
                const sequence = addEleSeq(state.values, value, index);
                sequence.forEach((event, i) => {
                    setTimeout(() => {
                        dispatch({ type: event.type, payload: event.payload })
                    }, i * DISPATCH_INTERVAL)
                })
            }

        } else {
            message.warning('添加失败，数组最大容量为10')
        }

    }

    /** 处理删除元素 */
    const handleDeleteEle = (index: number) => {
        if (state.values.length > 0) {
            if (index > state.values.length) {
                message.warning('输入的序号不合法')
            } else {
                const sequence = deleteEleSeq(state.values, index);
                sequence.forEach((event, i) => {
                    setTimeout(() => {
                        dispatch({ type: event.type, payload: event.payload })
                    }, i * DISPATCH_INTERVAL)
                })
            }
        } else {
            message.warning('删除失败，当前数组为空')
        }
    }

    /** 处理动画速度改变 */
    const handleSliderChange = (value: number) => {
        // console.log(value);
    }


    return (
        <div className='sort-warp'>
            <PageHeader
                onBack={() => {
                    history.replace('/data-structure-visualization/')
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
                                disappear={!state.randomDone || item.disappear}
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
                    onAdd={handleAddEle}
                    onDelete={handleDeleteEle}
                    operation={
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
                    }

                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item, i) => {
                                const { type, payload } = item;
                                switch (type) {
                                    case OpeDetailTypes.Swap:
                                        return (
                                            <Step
                                                key={i + 'step'}
                                                title={`交换元素: i1=${payload.indexes[0]}, i2=${payload.indexes[1]}`}
                                                description={`当前数组: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Add:
                                        return (
                                            <Step
                                                key={i + 'step'}
                                                title={`新增元素: i=${payload.index}, v=${payload.value}`}
                                                description={`当前数组: [${payload.curValues.toString()}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Delete:
                                        return (
                                            <Step
                                                key={i + 'step'}
                                                title={`删除元素: i=${payload.index}, v=${payload.value}`}
                                                description={`当前数组: [${payload.curValues.toString()}]`}
                                            />
                                        )
                                    default:
                                        return (
                                            <Step
                                                key={i + 'step'}
                                                title={`当前数组: [${payload.toString()}]`}
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