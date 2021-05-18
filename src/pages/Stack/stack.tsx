import { useHistory } from 'react-router';
import { Button, Drawer, Input, PageHeader } from 'antd';
import Scene3d from '../../components/Scene3d/scene3d'
import StackCube3d from './StackCube3d/stackCube3d';
import { useReducer, useState } from 'react';
import { ActionTypes, IGeometryProps, STACK_CUBE_INTERVAL_DISTANCE } from '../../types';
import { getStartYPos, initCubes } from '../../utils/stack';
import { randomArr, randomNum } from '../../utils';
import Console, { Item, SubMenu } from '../../components/Console/console';
import { BarChartOutlined, DotChartOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import './stack.scss'

export interface IStackCube extends IGeometryProps {

}

const initState: IState = {
    cubes: [],
    popDone: true,
    randomDone: true
}

interface IState {
    cubes: IStackCube[];
    randomDone: boolean;
    popDone: boolean;
}

interface IAction {
    type: ActionTypes;
    payload?: any;
}

type IReducer = (state: IState, action: IAction) => IState;

function reducer(state: IState = initState, action: IAction): IState {
    const { type, payload } = action;

    switch (type) {
        case ActionTypes.Pop:
            return {
                ...state
            }
        case ActionTypes.PopDone:
            return {
                ...state
            }
        case ActionTypes.Push:
            return {
                ...state
            }

        case ActionTypes.PushDone:
            return {
                ...state
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            }
        case ActionTypes.RandomDone:
            return {
                ...state,
                cubes: initCubes(randomArr(randomNum(4, 10))),
                randomDone: true
            }
        default:
            return state;
    }
}


const Stack = () => {
    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => ({
        cubes: initCubes(randomArr(randomNum(4, 10))),
        popDone: true,
        randomDone: true
    }));

    /** stackCube的起始坐标 */
    const startPosY = getStartYPos(state.cubes.length);

    /** 控制抽屉是否展开 */
    const [isUnfold, setIsUnfold] = useState(false);

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    const handlePop = () => {
        dispatch({ type: ActionTypes.Pop })
        setTimeout(() => {
            dispatch({ type: ActionTypes.PopDone })
        }, 400)
    }

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
                    history.goBack();
                    window.location.reload();
                }}
                title='栈'
            />
            <div className='main'>
            <Scene3d onLoaded={handleSceneLoaded}>
                {state.cubes.map((item, i) => (
                    <StackCube3d
                        value={item.value}
                        startPosY={startPosY}
                        position={[0, startPosY + (i * STACK_CUBE_INTERVAL_DISTANCE), 0]}
                        key={i + '!'}
                        isReset={!state.randomDone}
                    />
                ))}
            </Scene3d>
                <Console
                    onUnFold={() => { setIsUnfold(true) }}
                    style={{ display: isSceneLoaded ? 'inline-block' : 'none' }}
                >
                    <Item
                        icon={<DotChartOutlined />}
                        onClick={handleRandom}
                    >
                        随机生成
                    </Item>

                    <SubMenu
                        key='2'
                        icon={<BarChartOutlined />}
                        title='排序'
                    >
                        <Item>冒泡排序</Item>
                        <Item>选择排序</Item>
                        <Item>插入排序</Item>
                        <Item>快速排序</Item>
                        <Item>归并排序</Item>
                    </SubMenu>

                    <SubMenu
                        icon={<PlusSquareOutlined />}
                    >
                        <Item>
                            <Input />
                            <Button>添加</Button>
                        </Item>
                    </SubMenu>

                    <Item icon={<MinusSquareOutlined />}>删除</Item>

                </Console>
                <Drawer
                    className='console-drawer'
                    title='操作台'
                    visible={isUnfold}
                    placement='left'
                    mask={false}
                    onClose={() => { setIsUnfold(false) }}
                >
                    <Button>随机生成</Button>
                    <Button>冒泡排序</Button>
                    <Button>选择排序</Button>
                    <Button>插入排序</Button>
                    <Button>快速排序</Button>
                    <Button>归并排序</Button>
                    <Button>添加</Button>
                    <Button>删除</Button>

                </Drawer>

            
            </div>
        </div>
    )
}

export default Stack;