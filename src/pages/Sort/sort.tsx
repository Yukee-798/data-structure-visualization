import { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps, message } from 'antd';
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons';
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import SortCube3d from './SortCube3d/sortCube3d';
import Scene3d from '../../components/Scene3d/scene3d';
import { addEleSeq, bubbleSortSeq, deleteEleSeq, getStartPosX, initCubes, parseValue, quickSortSeq, initSeq, selectSortSeq, mergeSortSeq } from './utils';
import { OpeDetailTypes, IReducer, SeqType } from '../../types';
import { initState, IState, reducer } from './store';
import config from './config'
import { root } from '../../configs/router/config';
import { excuteSeq, randomArr, randomNum } from '../../utils';

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

    /** 随机生成数组 */
    const handleRandom = () => {
        let sequence = initSeq(randomArr(randomNum(config.geoNumRange), config.geoValueRange));
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** 处理冒泡排序 */
    const handleBubbleSort = () => {
        let sequence = bubbleSortSeq(state.values);
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** 处理选择排序 */
    const handleSelectSort = () => {
        let sequence = selectSortSeq(state.values);
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** 处理快速排序 */
    const handleQuickSort = () => {
        let sequence: any[] = [];
        quickSortSeq([...state.values], 0, state.values.length - 1, sequence);
        excuteSeq(sequence, config.animationSpeed, dispatch);
    }

    /** 处理添加元素 */
    const handleAddEle = (index: number, value: number) => {

        if (state.values.length < config.geoNumRange[1] + 3) {
            if (index > state.values.length || index < 0) {
                message.warning('输入的序号不合法')
            } else {
                const sequence = addEleSeq(state.values, value, index);
                excuteSeq(sequence, config.animationSpeed, dispatch);
            }

        } else {
            message.warning(`添加失败，数组最大容量为${config.geoNumRange[1] + 3}`)
        }
    }

    /** 处理删除元素 */
    const handleDeleteEle = (index: number, value: number) => {
        if (state.values.length > 0) {
            if (index > state.values.length - 1 || index < 0) {
                message.warning('输入的序号不合法')
            } else {
                const sequence = deleteEleSeq(state.values, index);
                excuteSeq(sequence, config.animationSpeed, dispatch);
            }
        } else {
            message.warning('删除失败，当前数组为空')
        }
    }

    const handleMergeSort = () => {
        const arr = [3, 2, 1];
        const seq: SeqType = [];
        mergeSortSeq(arr, 0, arr.length - 1, seq);
        excuteSeq(seq, config.animationSpeed, dispatch)
        // console.log(arr);
    }

    /** 处理动画速度改变 */
    const handleSliderChange = (x: number) => {
        config.animationSpeed = -7.95 * x + 1000
    }



    return (
        <div className='sort-warp'>
            <PageHeader
                onBack={() => {
                    history.replace(root)
                    window.location.reload();
                }}
                title='排序'
            />
            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
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
                                position={[state.startPosX + (item.sortIndex * config.geoBaseDistance), ((item.value as number) * 0.2) / 2 + config.geoBasePosY, 0]}
                                disappear={item.disappear}
                            />
                        ))
                    }
                    {
                        state.values.map((_, index) => (
                            <Text
                                key={index + '*'}
                                fillOpacity={state.disappearAll ? 0 : 1}
                                color='black'
                                fontSize={0.5}
                                position={[state.startPosX + (index * config.geoBaseDistance), -1 + config.geoBasePosY, 0]}
                            >
                                {index}
                            </Text>
                        ))
                    }
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    radioGroup={[1, 1, 0]}
                    addConfig={{
                        hasIndex: true,
                        hasValue: true,
                        indexRange: [0, state.values.length],
                        valueRange: config.geoValueRange,
                        radioName: '添加'
                    }}
                    deleteConfig={{
                        hasIndex: true,
                        hasValue: false,
                        indexRange: [0, state.values.length - 1],
                        radioName: '删除'
                    }}
                    onSliderChange={handleSliderChange}
                    onAdd={handleAddEle}
                    onDelete={handleDeleteEle}
                    spinning={state.loading}
                    onRender={handleRender}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>
                                <Button icon={<BarChartOutlined />} onClick={handleBubbleSort}>冒泡排序</Button>
                                <Button icon={<BarChartOutlined />} onClick={handleSelectSort}>选择排序</Button>
                                <Button icon={<BarChartOutlined />} onClick={handleQuickSort}>快速排序</Button>

                            </div>
                            {/* <div className='row'> */}
                                {/* <Button icon={<BarChartOutlined />} onClick={handleMergeSort}>归并排序</Button> */}
                            {/* </div> */}
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

                    {/* <SubMenu
                        key='item2'
                        icon={<BarChartOutlined />}
                        title='排序'
                    >
                        <Item onClick={handleBubbleSort}>冒泡排序</Item>
                        <Item onClick={handleSelectSort}>选择排序</Item>
                        <Item>插入排序</Item>
                        <Item onClick={handleQuickSort}>快速排序</Item>
                        <Item>归并排序</Item>
                    </SubMenu> */}
                </Console>

            </div>
        </div>
    )
}

export default Sort;