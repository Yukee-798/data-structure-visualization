import { ActionTypes, IBaseState, IReducer, OpeDetailTypes } from "../../types";
import { randomArr, randomNum } from "../../utils";
import { getStartPosX, initCubes } from "./utils";
import config from './config'
import { ICube3dProps } from "../../components/Cube3d/cube3d";

export interface ISortCube extends ICube3dProps {
    // 记录 cube 将要经历或者已经历过的下标
    sortIndexes: number[];
    // 记录 cube 当前页面中正处于的下标
    sortIndex: number;
}

export interface IState extends IBaseState {
    // 用来表示数组中各值的实时位置
    values: number[];
    // 用来表示每个 cube 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    cubes: ISortCube[];
    // 第一个cube的起始x坐标
    startPosX: number;
}

export const initState: IState = {
    values: randomArr(randomNum(config.geoNumRange), config.geoValueRange),
    cubes: [],
    loading: false,
    disappearAll: false,
    startPosX: 0,
    opeDetails: []
}

export const reducer: IReducer<IState> = (state = initState, action) => {

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
                cubes: initCubes(payload),
                startPosX: getStartPosX(payload.length),
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
                    disappearAll: true
                }
            } else {
                return {
                    ...state
                }
            }
        }

        case ActionTypes.Active:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => (payload?.includes(item.sortIndexes[item.sortIndexes.length - 1]) ? { ...item, isActive: true } : { ...item })
                ),
                sortDone: false
            }

        case ActionTypes.Deactive:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndexes[item.sortIndexes.length - 1]) ? { ...item, isActive: false } : { ...item }
                )
            }

        case ActionTypes.Lock: {
            if (!payload && payload !== 0) {
                return {
                    ...state,
                    cubes: state.cubes.map((item) => ({ ...item, isLock: true }))
                }
            } else {
                return {
                    ...state,
                    cubes: state.cubes.map(
                        (item) => payload?.includes(item.sortIndexes[item.sortIndexes.length - 1]) ? { ...item, isLock: true } : { ...item }
                    )
                }
            }
        }


        case ActionTypes.UnLock:
            return {
                ...state,
                cubes: state.cubes.map(
                    (item) => payload?.includes(item.sortIndexes[item.sortIndexes.length - 1]) ? { ...item, isLock: false } : { ...item }
                )
            }

        case ActionTypes.Swap: {

            // 取出需要交换的两个下标
            // 取出需要交换的两个下标
            let index1 = (payload as number[])[0];
            let index2 = (payload as number[])[1];

            // 向 cube 对应的 sortIndexes 中 push 新的下标
            const newCubes: ISortCube[] = state.cubes.map((item) => {
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
                    curValues: [...newValues]
                }
            }

            return {
                ...state,
                cubes: newCubes,
                opeDetails: [...state.opeDetails, newOpeDetail],
                values: newValues
            }
        }

        case ActionTypes.SwapDone: {

            // 交换完毕后，将对应的cube的sortIndex改为最新的sortIndex
            const newCubes: ISortCube[] = state.cubes.map((item) => {
                const newSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                if (item.sortIndex !== newSortIndex) return { ...item, sortIndex: newSortIndex }
                return { ...item }
            })

            return {
                ...state,
                cubes: newCubes,
            }
        }

        case ActionTypes.SortDone:
            return {
                ...state,
                sortDone: true
            }

        case ActionTypes.Move: {
            const { oldIndexes, targetIndexes }: { oldIndexes: number[], targetIndexes: number[] } = payload;
            // 把包含在 oldIndexes 中的 sortIndex 找出来
            const newCubes = state.cubes.map((item) => {
                // 看 sortIndex 在 oldIndexes 中处于哪个位置，也对应 targetIndexes 的位置
                let i = oldIndexes.findIndex((value) => value === item.sortIndex);
                // 如果找到了，则往 sortIndexes 中添加 targetIndexes[i]
                if (i >= 0) {
                    return {
                        ...item,
                        sortIndexes: [...item.sortIndexes, targetIndexes[i]]
                    }
                }
                return { ...item }
            })


            let newValues: number[] = [...state.values];

            let newOpeDetail;

            // 判断是扩容还是缩容
            if (targetIndexes[0] > oldIndexes[0]) {
                // 扩容下标
                newValues.push(-1);
            } else {
                // 缩容下标
                newValues.splice(oldIndexes[0], 1);
                newOpeDetail = { type: OpeDetailTypes.Delete, payload: { index: oldIndexes[0], value: state.values[oldIndexes[0]], curValues: [...newValues] } }
            }

            return {
                ...state,
                cubes: newCubes,
                values: newValues,
                opeDetails: newOpeDetail ? [...state.opeDetails, newOpeDetail] : [...state.opeDetails]
            }
        }

        case ActionTypes.AddDone: {
            const { newEle, targetIndex } = payload;

            // 生成新 cube
            const newCube: ISortCube = {
                sortIndex: targetIndex,
                sortIndexes: [targetIndex],
                value: newEle
            }

            // 更新 cube 的 sortIndex 到最新
            let newCubes = state.cubes.map((item, i) => {
                const curSortIndex = item.sortIndex;
                const newSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                if (curSortIndex !== newSortIndex) {
                    return { ...item, sortIndex: newSortIndex };
                }
                return { ...item };
            })

            // 添加新 cube
            newCubes.push(newCube);

            // 更新 values
            let newValues = [...state.values];
            newValues.splice(targetIndex, 0, newEle);
            if (targetIndex !== state.values.length) newValues.pop();

            const newOpeDetail = { type: OpeDetailTypes.Add, payload: { index: targetIndex, value: newEle, curValues: [...newValues] } }

            return {
                ...state,
                cubes: newCubes,
                values: newValues,
                opeDetails: [...state.opeDetails, newOpeDetail]
            }
        }

        case ActionTypes.Delete: {
            const newCubes = state.cubes.map((item) => item.sortIndex === payload ? { ...item, disappear: true } : { ...item });

            return {
                ...state,
                cubes: newCubes
            }
        }

        case ActionTypes.DeleteDone: {

            let newCubes = [...state.cubes];

            // 先把删除的元素真正意义上从 cubes 中删除
            newCubes.splice(payload, 1);

            // 更新 cube 的 sortIndex 到最新
            newCubes = state.cubes.map((item) => {
                const curSortIndex = item.sortIndex;
                const newSortIndex = item.sortIndexes[item.sortIndexes.length - 1];
                if (curSortIndex !== newSortIndex) {
                    return { ...item, sortIndex: newSortIndex };
                }
                return { ...item };
            })

            return {
                ...state,
                cubes: newCubes
            }
        }

        default:
            return state;
    }
}
