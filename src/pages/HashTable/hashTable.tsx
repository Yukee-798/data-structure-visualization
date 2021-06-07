import { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Drawer, Input, PageHeader, Steps } from 'antd';
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import Scene3d from '../../components/Scene3d/scene3d';
import {
    BarChartOutlined,
    DotChartOutlined,
    MinusSquareOutlined,
    PlusSquareOutlined,
} from '@ant-design/icons';
import { OpeDetailTypes } from '../../types';
import config from './config'

const { Step } = Steps;

const HashTable = () => {

    const history = useHistory();
    // const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
    //     return {
    //         ...state,
    //     }
    // })

    /** 控制抽屉是否展开 */
    const [isUnfold, setIsUnfold] = useState(false);

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 传入数组长度，计算第一个元素的起始x坐标 */
    // const startPosX = getStartXPos(state.cubes.length);


    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 随机生成数据 */
    const handleRandom = () => {

    }
    return (
        <div className='hashTable-warp'>
            <PageHeader
                onBack={() => {
                    history.goBack();
                    window.location.reload();
                }}
                title='哈希表'
            />

            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >
                    {/* {state.cubes.map((item, i, arr) => (
                        <React.Fragment key={item.key}>
                            <QueueCube3d
                                value={item.value}
                                position={[startPosX + (i * config.geoBaseDistance), config.geoBasePosY, 0]}
                                isActive={item.isActive}
                                disappear={item.disappear}
                            />
                            {i === 0 || i === arr.length - 1 ?
                                <Text
                                    fillOpacity={!state.disappearAll ? 1 : 0}
                                    color='black'
                                    fontSize={0.5}
                                    position={[startPosX + (i * config.geoBaseDistance), config.geoBasePosY - 1, 0]}
                                >
                                    {i === 0 ? 'head' : 'tail'}
                                </Text> : <></>
                            }
                        </React.Fragment>
                    ))} */}
                </Scene3d>
                <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    showSilider={false}
                    radioGroup={[1,1,1]}
                    // onAdd={handleEnqueue}
                    // onDelete={handleDequeue}
                    // spinning={state.loading}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>
                            </div>
                        </div>
                    }

                    displayer={
                        <Steps direction="vertical" size="small" /* current={state.opeDetails.length - 1} */>
                            {/* {state.opeDetails.map((item, i) => {
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
                            })} */}
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

export default HashTable;


