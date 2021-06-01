import { v4 as uuidv4 } from 'uuid';
import { ActionTypes, IGeometryProps, IReducer, OpeDetailTypes } from "../../types";
import { randomArr, randomNum } from "../../utils";
import { initCubes } from './utils';
import config from './config';

export interface IQueueCube extends IGeometryProps {
    key: any;
}

export interface IState {
    values: number[];
    cubes: IQueueCube[];
    disappearAll: boolean;
    opeDetails: { type: OpeDetailTypes, payload?: any }[]

}



export const initState: IState = {
    values: randomArr(randomNum(config.geoNumRange), config.geoValueRange),
    disappearAll: false,
    cubes: [],
    opeDetails: []
}

export const reducer: IReducer<IState> = (state = initState, action) => {
    const { type, payload } = action;

    switch (type) {

        case ActionTypes.Generate: {
            return {
                ...state,
                values: payload,
                cubes: initCubes(payload),
                opeDetails: [{ type: OpeDetailTypes.Default, payload }]
            }
        }

        case ActionTypes.Appear: {
            if (!payload && payload !== 0) {
                return {
                    ...state,
                    cubes: state.cubes.map((item) => ({ ...item, disappear: false })),
                    disappearAll: false,
                }
            } else {
                return {
                    ...state
                }
            }
        }

        case ActionTypes.Disappear: {
            if (!payload && payload !== 0) {
                return {
                    ...state,
                    cubes: state.cubes.map((item) => ({ ...item, disappear: true })),
                    disappearAll: true,
                    opeDetails: []
                }
            } else {
                const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                    ...item,
                    disappear: i === payload
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }
        }

        case ActionTypes.Active: {
            const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                ...item,
                isActive: i === payload
            }))

            return {
                ...state,
                cubes: newCubes
            }
        }
        case ActionTypes.Deactive: {
            const newCubes: IQueueCube[] = state.cubes.map((item, i) => ({
                ...item,
                isActive: i === payload ? false : item.isActive
            }))

            return {
                ...state,
                cubes: newCubes
            }
        }

        case ActionTypes.Enqueue: {
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

        case ActionTypes.Dequeue: {
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

        default:
            return state;
    }
}

