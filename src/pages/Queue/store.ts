import { v4 as uuidv4 } from 'uuid';
import { ActionTypes, IGeometryProps, IReducer, OpeDetailTypes } from "../../types";
import { randomArr, randomNum } from "../../utils";
import { initCubes } from '../../utils/queue';

export interface IQueueCube extends IGeometryProps {
    key: any;
}

export interface IState {
    values: number[];
    cubes: IQueueCube[];
    randomDone: boolean;
    opeDetails: { type: OpeDetailTypes, payload?: any }[]
}



export const initState: IState = {
    randomDone: true,
    values: randomArr(randomNum(3, 6)),
    cubes: [],
    opeDetails: []
}

export const reducer: IReducer<IState> = (state = initState, action) => {
    const { type, payload } = action;

    switch (type) {
        case ActionTypes.Active:
            {
                const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                    ...item,
                    isActive: i === payload
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }
        case ActionTypes.Deactive:
            {
                const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                    ...item,
                    isActive: i === payload ? false : item.isActive
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.Disappear:
            {
                const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                    ...item,
                    disappear: i === payload
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.Enqueue:
            {
                const newCubes = [...state.cubes]
                const newCube: IQueueCube = {
                    value: payload,
                    isActive: true,
                    key: uuidv4()
                };
                const newValues = [...state.values]
                newCubes.push(newCube);
                newValues.push(payload);

                return {
                    ...state,
                    cubes: newCubes,
                    values: newValues,
                    opeDetails: [...state.opeDetails, {
                        type: OpeDetailTypes.Enqueue,
                        payload: {
                            enqueueValue: payload,
                            curValues: newValues
                        }
                    }]
                }
            }

        case ActionTypes.Dequeue:
            {
                const newCubes: IQueueCube[] = [...state.cubes];
                newCubes.shift();
                const newValues = [...state.values];
                const dequeueValue = newValues.shift();

                return {
                    ...state,
                    opeDetails: [...state.opeDetails, {
                        type: OpeDetailTypes.Dequeue,
                        payload: {
                            dequeueValue,
                            curValues: newValues
                        }
                    }],
                    values: newValues,
                    cubes: newCubes
                }
            }

        case ActionTypes.RandomDone:
            {
                let newValues = randomArr(randomNum(3, 6));
                return {
                    ...state,
                    cubes: initCubes(newValues),
                    randomDone: true,
                    values: newValues,
                    opeDetails: [{ type: OpeDetailTypes.Default, payload: newValues }]
                }
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            };

        default:
            return state;
    }
}

