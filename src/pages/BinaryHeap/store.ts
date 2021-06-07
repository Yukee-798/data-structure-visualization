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

        case ActionTypes.Add: {
            const newGeo = [...state.geometries];
            newGeo.push({
                sortIndex: newGeo.length,
                sortIndexes: [newGeo.length],
                value: payload,
            })
            const newValues = [...state.values];
            newValues.push(payload)

            const newOpeDetail = {
                type: OpeDetailTypes.Add,
                payload: {
                    value: payload,
                    cur: newValues
                }
            }

            return {
                ...state,
                geometries: newGeo,
                values: newValues,
                opeDetails: [...state.opeDetails, newOpeDetail]
            }
        }

        case ActionTypes.Swap: {
            // 取出需要交换的两个下标
            let index1 = (payload as number[])[0];
            let index2 = (payload as number[])[1];

            // 向 cube 对应的 sortIndexes 中 push 新的下标
            const newGeo: IBinaryHeapSphere3d[] = state.geometries.map((item) => {
                const curSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                if (curSortIndex === index1) {
                    const newSortIndexes = [...item.sortIndexes, index2]
                    return { ...item, sortIndexes: newSortIndexes }
                } else if (curSortIndex === index2) {
                    const newSortIndexes = [...item.sortIndexes, index1]
                    return { ...item, sortIndexes: newSortIndexes }
                }
                return { ...item };
            })

            // 交换 values 的值
            let newValues = [...state.values];
            let temp = newValues[index1];
            newValues[index1] = newValues[index2];
            newValues[index2] = temp;

            const newOpeDetail = {
                type: OpeDetailTypes.Swap,
                payload: {
                    indexes: [index1, index2],
                    cur: [...newValues]
                }
            }

            return {
                ...state,
                geometries: newGeo,
                opeDetails: [...state.opeDetails, newOpeDetail],
                values: newValues
            }
        }

        case ActionTypes.SwapDone: {

            // 交换完毕后，将对应的cube的sortIndex改为最新的sortIndex
            const newGeo: IBinaryHeapSphere3d[] = state.geometries.map((item) => {
                const newSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                if (item.sortIndex !== newSortIndex) return { ...item, sortIndex: newSortIndex }
                return { ...item }
            })

            return {
                ...state,
                geometries: newGeo,
            }
        }

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
                    isActive: payload === item.sortIndex ? true : item.isActive
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