import { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Drawer, Input, PageHeader } from 'antd';
import { Map, List } from 'immutable'
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import LinkCube3d from './LinkCube3d/linkCube3d'
import Scene3d from '../../components/Scene3d/scene3d';
import { randomArr, randomNum } from '../../utils/index'
import { bubbleSortSeq, getStartXPos, initCubes, quickSortSeq, selectSortSeq } from '../../utils/sort';
import { ActionTypes, BASE_POSY, SORT_CUBE_INTERVAL_DISTANCE, DISPATCH_INTERVAL, IGeometryProps } from '../../types';
import {
    BarChartOutlined,
    DotChartOutlined,
    MinusSquareOutlined,
    PlusSquareOutlined,
} from '@ant-design/icons'; import './linkedList.scss'
import Arrow3d from '../../components/Arrow3d/arrow3d';

export interface ILinkCube extends IGeometryProps {

}
type IReducer = (state: IState, action: IAction) => IState;

interface IState {
    // 是否随机化完毕
    randomDone: boolean;
}

interface IAction {
    type: ActionTypes;
    payload?: any;
}

const initState: IState = {
    randomDone: true,
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

        case ActionTypes.Lock:
            return {
                ...state,
            }

        case ActionTypes.UnLock:
            return {
                ...state,
            }


        // case ActionTypes.Add:

        // case ActionTypes.Delete:

        case ActionTypes.RandomDone:
            {
                return {
                    ...state,
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

const LinkedList = () => {

    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
        }
    })

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
        dispatch({ type: ActionTypes.Random });
        setTimeout(() => {
            dispatch({ type: ActionTypes.RandomDone })
        }, 400);
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
                    <LinkCube3d
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
                    />
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

export default LinkedList;