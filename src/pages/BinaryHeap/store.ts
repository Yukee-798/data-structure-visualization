import { ActionTypes, IBaseState, IReducer, OpeDetailTypes } from "../../types";
import { initSpheres, treeToString } from "../../utils/binaryTree";
import { IBinaryHeapSphere3dProps } from "./BinaryHeapSphere3d/binaryHeapSphere3d";
import config, { cdnOfNodes } from "./config";
import { randomBh } from "./utils";

export interface IBinaryHeapSphere3d extends IBinaryHeapSphere3dProps { }

export interface IState extends IBaseState {
    values: number[];
    geometries: IBinaryHeapSphere3d[];
    opeDetails: any[];
}

export const initState: IState = {
    values: randomBh(config.geoNumRange, config.geoValueRange),
    geometries: [],
    opeDetails: [],
    disappearAll: false,
    loading: false
}

export const reducer: IReducer<IState> = (state = initState, action): IState => {
    const { type, payload } = action;
    switch (type) {


        case ActionTypes.Loading:
            return {
                ...state,
                loading: true
            }

        case ActionTypes.CancelLoading:
            return {
                ...state,
                loading: false
            }

        case ActionTypes.Generate: {
            return {
                ...state,
                values: payload,
                geometries: initSpheres(payload),
                opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString(payload) }]
            }
        }

        case ActionTypes.Appear: {
            if (!payload && payload !== 0) {
                return {
                    ...state,
                    geometries: state.geometries.map((item) => ({ ...item, disappear: false })),
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
                    geometries: state.geometries.map((item) => ({ ...item, disappear: true })),
                    disappearAll: true
                }
            } else {
                return {
                    ...state
                }
            }
        }

        case ActionTypes.Move: {


            return {
                ...state,
            }
        }

        case ActionTypes.Active:
            return {
                ...state,
                geometries: state.geometries.map((item) => ({
                    ...item,
                    isActive: payload === item.sortIndex
                }))
            }

        case ActionTypes.ActiveLeft:
            return {
                ...state,
                geometries: state.geometries.map((item) => ({
                    ...item,
                    activeLeft: payload === item.sortIndex
                }))
            }

        case ActionTypes.ActiveRight:
            return {
                ...state,
                geometries: state.geometries.map((item) => ({
                    ...item,
                    activeRight: payload === item.sortIndex
                }))
            }

        case ActionTypes.Deactive:
            return {
                ...state,
                geometries: state.geometries.map((item) => ({
                    ...item,
                    isActive: payload === item.sortIndex ? false : item.isActive
                }))
            }

        case ActionTypes.Lock:
            return {
                ...state,
                geometries: state.geometries.map(
                    (item) => payload === item.sortIndex ? { ...item, isLock: true } : { ...item }
                )
            }

        case ActionTypes.UnLock:
            return {
                ...state,
                geometries: state.geometries.map(
                    (item) => (!payload && payload !== 0) ? { ...item, isLock: false } : (payload === item.sortIndex) ? { ...item, isLock: false } : { ...item }
                )
            }

        default:
            return state
    }
}