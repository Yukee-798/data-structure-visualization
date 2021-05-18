import { useHistory } from 'react-router';
import { Button, PageHeader } from 'antd';
import Scene3d from '../../components/Scene3d/scene3d'
import './stack.scss'
import StackCube3d from './StackCube3d/stackCube3d';
import { useReducer, useState } from 'react';
import { ActionTypes, IGeometryProps, STACK_CUBE_INTERVAL_DISTANCE } from '../../types';
import { getStartYPos, initCubes } from '../../utils/stack';
import { randomArr, randomNum } from '../../utils';
import Console from '../../components/Console/console';

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

    const startPosY = getStartYPos(state.cubes.length);

    return (
        <div className='stack-warp'>
            <PageHeader
                onBack={() => {
                    history.goBack();
                    window.location.reload();
                }}
                title='栈'
            />
            <Scene3d>
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
            <Console>
                <Button onClick={() => {
                    dispatch({ type: ActionTypes.Pop })
                    setTimeout(() => {
                        dispatch({ type: ActionTypes.PopDone })
                    }, 400)
                }}
                >
                    弹栈
                </Button>
                <Button>
                    压栈
                </Button>
                <Button>
                    恢复
                </Button>
                <Button
                    onClick={() => {
                        dispatch({ type: ActionTypes.Random });
                        setTimeout(() => {
                            dispatch({ type: ActionTypes.RandomDone })
                        }, 400)
                    }}
                >
                    随机生成
                </Button>

            </Console>
        </div>
    )
}

export default Stack;