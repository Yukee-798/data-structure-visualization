import Scene3d from '../../components/Scene3d/scene3d';
import Cuboid3d from '../../components/Cuboid3d/cuboid3d'
import { Button } from 'antd';
import './array.scss'
import { useEffect, useReducer, useRef, useState } from 'react';
import { bubbleSortSeq, getStartXPos, initCubes, randomArr } from '../../utils/array';
import { Text } from '@react-three/drei';
import { ICube } from '../../types';
import { Map, List } from 'immutable'
import { animated, useSpring } from '@react-spring/three';
import Test from '../../components/Test/test';

type IReducer = (state: IState, action: IAction) => IState;

interface IState {
    values: number[];
    cubes: ICube[];
    sortDone: boolean;
    randomDone: boolean;
}

export enum ActionTypes {
    Active,
    Deactive,
    Swap,
    Lock,
    SortDone,
    RandomDone,
    Random,
    Add,
    Delete,
    Search,
}

interface IAction {
    type: ActionTypes;
    payload?: number[];
}

const initState: IState = {
    // 用来表示数组中各值的实时位置
    values: [],
    // 用来表示每个 cube 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    cubes: [],
    sortDone: true,
    randomDone: true,
}

function reducer(state: IState = initState, action: IAction): IState {

    const { type, payload } = action;

    state.cubes = List(state.cubes).toJS().map((item) => Map(item).toJS()) as ICube[];

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

        case ActionTypes.Swap:

            // 取出需要交换的两个下标
            let index1 = (payload as number[])[0];
            let index2 = (payload as number[])[1];

            // 交换 values 的值
            let newValues = [...state.values];
            let temp = newValues[index1];
            newValues[index1] = newValues[index2];
            newValues[index2] = temp;

            // 交换 cubes 中对应下标的 sortIndex
            const newCubes: ICube[] = state.cubes.map((item) => {
                if (item.sortIndex === index1) return { ...item, sortIndex: index2 }
                else if (item.sortIndex === index2) return { ...item, sortIndex: index1 }
                return { ...item };
            })
            return { ...state, cubes: newCubes }

        case ActionTypes.SortDone:
            return {
                ...state,
                sortDone: true
            }

        // case ActionTypes.Add:

        // case ActionTypes.Delete:

        case ActionTypes.RandomDone:
            let newValues1 = randomArr();
            return {
                ...state,
                cubes: initCubes(newValues1),
                values: newValues1,
                randomDone: true
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

const Array = () => {

    const [state, dispatch] = useReducer<IReducer, IState>(reducer, initState, (state): IState => {
        let initValues = randomArr();
        return {
            ...state,
            values: initValues,
            cubes: initCubes(initValues),
        }
    })

    /* 传入数组长度，计算第一个元素的起始x坐标 */
    const startPos = getStartXPos(state.cubes.length);

    /* 处理排序：等间隔时间来 dispatch action  */
    const handleSort = () => {
        let sequence = bubbleSortSeq(state.cubes.map((item) => (item.value)));
        sequence.forEach((event, i) => {
            setTimeout(() => {
                dispatch({ type: event.type, payload: event.indexes })
            }, i * 250);
        })
    }

    const handleClick = () => {

    }

    // const isSorted = (): boolean => {
    //     for (let i = 0; i < state.values.length - 1; i++) {
    //         if (state.values[i] > state.values[i + 1]) return false;
    //     }
    //     return true;
    // }

    return (
        <div className='array-warp'>
            <Button
                onClick={() => {
                    dispatch({ type: ActionTypes.Random });
                    setTimeout(() => {
                        dispatch({ type: ActionTypes.RandomDone })
                    }, 400)
                }}
                disabled={!state.randomDone || !state.sortDone}
            >
                {state.randomDone ? 'Random' : 'Randomizing...'}
            </Button>

            <Button
                disabled={!state.randomDone || !state.sortDone}
            >
                Add
            </Button>

            <Button
                disabled={!state.randomDone || !state.sortDone}
            >
                Delete
            </Button>

            <Button
                onClick={handleSort}
                disabled={!state.randomDone || !state.sortDone}
            >
                {state.sortDone ? 'Sort' : 'Sorting...'}
            </Button>

            <Button
                onClick={handleClick}
                disabled={!state.randomDone || !state.sortDone}
            >
                Recover
            </Button>

            <Scene3d>
                {
                    state.cubes.map((item, index) => (
                        <Cuboid3d
                            arrCubeConfig={{
                                sortIndex: item.sortIndex,
                                value: item.value + '',
                                startPos
                            }}
                            isActive={item.isActive}
                            isLock={item.isLock}
                            // position={[getStartXPos(state.cubes.length) + (index * 2.5), 0, 0]}
                            isReset={!state.randomDone}
                        />
                    ))
                }
                {
                    state.cubes.map((_, index) => (
                        <Text
                            fillOpacity={state.randomDone ? 1 : 0}
                            color='black'
                            fontSize={0.5}
                            position={[getStartXPos(state.cubes.length) + (index * 2.5), -1, 0]}
                        >
                            {index}
                        </Text>
                    ))
                }
                {/* <Test /> */}
            </Scene3d>
        </div>
    )
}

export default Array;