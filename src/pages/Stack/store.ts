import { ActionTypes, IGeometryProps, IReducer, OpeDetailTypes } from "../../types";
import { randomArr, randomNum } from "../../utils";
import { initCubes } from "./utils";
import config from './config'

export interface IStackCube extends IGeometryProps { }


export interface IState {
    cubes: IStackCube[];
    disappearAll: boolean;
    opeDetails: { type: OpeDetailTypes, payload?: any }[]
    values: number[]
}

export const initState: IState = {
    cubes: [],
    disappearAll: false,
    opeDetails: [],
    values: randomArr(randomNum(config.geoNumRange), config.geoValueRange)
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
                return {
                    ...state
                }
            }
        }

        case ActionTypes.Active:
            {
                const newCubes: IStackCube[] = state.cubes.map((item, i, arr) => ({
                    ...item,
                    isActive: i === arr.length - 1
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }
        case ActionTypes.Deactive:
            {
                const newCubes: IStackCube[] = state.cubes.map((item, i, arr) => ({
                    ...item,
                    isActive: (i === arr.length - 1) ? false : item.isActive
                }))

                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.Pop:
            {
                const newCubes: IStackCube[] = state.cubes.map((item, i, arr) => ({
                    ...item,
                    disappear: i === arr.length - 1
                }));

                const newValues = [...state.values];
                const popValue = newValues.pop();

                return {
                    ...state,
                    cubes: newCubes,
                    opeDetails: [...state.opeDetails, {
                        type: OpeDetailTypes.Pop,
                        payload: {
                            popValue,
                            curValues: newValues
                        }
                    }],
                    values: newValues
                }
            }

        case ActionTypes.PopDone:
            {
                const newCubes: IStackCube[] = [...state.cubes];
                newCubes.pop();
                return {
                    ...state,
                    cubes: newCubes
                }
            }

        case ActionTypes.Push:
            {
                const newCubes = [...state.cubes]
                const newCube: IStackCube = {
                    value: payload,
                    isActive: true
                };
                const newValues = [...state.values]
                newCubes.push(newCube);
                newValues.push(payload);

                return {
                    ...state,
                    cubes: newCubes,
                    values: newValues,
                    opeDetails: [...state.opeDetails, {
                        type: OpeDetailTypes.Push,
                        payload: {
                            pushValue: payload,
                            curValues: newValues
                        }
                    }]
                }
            }



        default:
            return state;
    }
}