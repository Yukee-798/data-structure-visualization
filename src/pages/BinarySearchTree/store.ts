import { ActionTypes, IBaseState, IReducer, OpeDetailTypes } from "../../types";
import { isNum } from "../../utils";
import { formatBinaryTree, formatSpheres, getChildrenIndexes, getFatherIndex, initSpheres, judgeNode, treeToString } from "../../utils/binaryTree";
import { IBSTSphere3dProps } from "./BSTSphere3d/bstSphere3d";
import config, { cdnOfNodes } from "./config";
import { randomBST } from "./utils";

export interface IBSTSphere3d extends IBSTSphere3dProps {
    /** 其下面的下标是否消失 */
    indexDisappear?: boolean;
}

export interface IState extends IBaseState {
    // 表示二叉树当前真实的结构
    binaryTree: (number | null)[];
    // 用来表示每个 sphere 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    spheres: IBSTSphere3d[];
}

export const initState: IState = {
    binaryTree: randomBST(config.geoNumRange, config.geoValueRange, config.maxDeepth),
    spheres: [],
    opeDetails: [],
    loading: false,
    disappearAll: false
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
                binaryTree: payload,
                spheres: initSpheres(payload),
                opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString(payload) }]
            }
        }

        case ActionTypes.Appear: {
            if (!payload && payload !== 0) {
                return {
                    ...state,
                    spheres: state.spheres.map((item) => ({ ...item, disappear: false })),
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
                    spheres: state.spheres.map((item) => ({ ...item, disappear: true })),
                    disappearAll: true
                }
            } else {
                // 判断删除的结点类型
                const deleteType = judgeNode(state.binaryTree, payload);
                let newSpheres = [...state.spheres];
                let newBst = [...state.binaryTree];

                if (deleteType === 0) {
                    // 让该结点消失
                    newSpheres = newSpheres.map((sphere) => (sphere.sortIndex === payload ? { ...sphere, disappear: true } : sphere));
                    // 让其父节点与之的连线也消失
                    let fatherIndex = getFatherIndex(payload);
                    // 判断是父结点左连线还是右连线(这里因为是二叉搜索树所以可以直接通过数值大小来判断)
                    let isLeft = (state.binaryTree[fatherIndex] as number) >= (state.binaryTree[payload] as number)
                    newSpheres = newSpheres.map((sphere) => {
                        let newSphere = { ...sphere };
                        if (sphere.sortIndex === fatherIndex) {
                            if (isLeft) newSphere.lChildPos = null;
                            else newSphere.rChildPos = null;
                        }
                        return newSphere;
                    })
                    newBst[payload] = null;

                    return {
                        ...state,
                        spheres: newSpheres,
                        opeDetails: [...state.opeDetails, {
                            type: OpeDetailTypes.Delete, payload: {
                                index: payload,
                                value: state.binaryTree[payload],
                                cur: formatBinaryTree(newBst)
                            }
                        }]
                    }

                } else if (deleteType === 1) {
                    // 让该结点消失
                    newSpheres = newSpheres.map((sphere) => (sphere.sortIndex === payload ? { ...sphere, disappear: true } : sphere));

                    // 找到被删除结点的子结点
                    let childrenIndexes = getChildrenIndexes(state.binaryTree, payload);
                    // let childIndex = childrenIndexes[0] || childrenIndexes[1]

                    let fatherIndex = getFatherIndex(payload);
                    // 判断是父结点左连线还是右连线(这里因为是二叉搜索树所以可以直接通过数值大小来判断)
                    let isLeft = (state.binaryTree[fatherIndex] as number) >= (state.binaryTree[payload] as number)

                    // 把被删除的结点的子结点的父节点与之的连线消失
                    newSpheres = newSpheres.map((sphere) => {
                        let newSphere = { ...sphere };
                        if (sphere.sortIndex === fatherIndex) {
                            if (isLeft) newSphere.lChildPos = null;
                            else newSphere.rChildPos = null;
                        }
                        return newSphere;
                    })


                    return {
                        ...state,
                        spheres: newSpheres,
                        // opeDetails: [...state.opeDetails, {
                        //     type: OpeDetailTypes.Delete, payload: {
                        //         index: payload,
                        //         value: state.binaryTree[payload],
                        //         cur: formatBinaryTree(newBst)
                        //     }
                        // }]
                    }

                } else {
                    return {
                        ...state
                    }
                }
            }
        }

        case ActionTypes.Move: {
            const { oldIndexes, targetIndexes }: { oldIndexes: number[], targetIndexes: number[] } = payload;

            // 把包含在 oldIndexes 中的 sortIndex 找出来
            const newSperes = state.spheres.map((item) => {
                // 看 sortIndex 在 oldIndexes 中处于哪个位置，也对应 targetIndexes 的位置
                let i = oldIndexes.findIndex((value) => value === item.sortIndex);
                // 如果找到了，则往 sortIndexes 中添加 targetIndexes[i]
                if (i >= 0) {
                    return {
                        ...item,
                        sortIndexes: [...item.sortIndexes, targetIndexes[i]],
                        indexDisappear: true
                    }
                }
                return { ...item }
            })

            let newBst = [...state.binaryTree];

            // 目标位置覆盖为：下标为oldIndex结点的取值
            targetIndexes.forEach((value, i) => {
                newBst[value] = newBst[oldIndexes[i]];
            })

            // 之前的旧位置取值变为null
            oldIndexes.forEach((value) => {
                newBst[value] = null;
            })

            newBst = formatBinaryTree(newBst);

            return {
                ...state,
                spheres: newSperes,
                binaryTree: newBst,
                opeDetails: [...state.opeDetails, {
                    type: OpeDetailTypes.Delete, payload: {
                        index: targetIndexes[0],
                        value: state.binaryTree[targetIndexes[0]],
                        cur: newBst
                    }
                }]

            }
        }

        case ActionTypes.Delete: {
            // 判断删除的结点类型
            let deleteType;

            if (isNum(payload)) {
                deleteType = 0;
            } else {
                deleteType = 1;
            }

            let newSpheres = [...state.spheres];
            let newBst = [...state.binaryTree];

            if (deleteType === 0) { // 删除的结点为叶子结点
                newSpheres = newSpheres.map((sphere) => {
                    if (sphere.sortIndex === payload) return { ...sphere, value: null }
                    return sphere;
                })
                newBst[payload] = null;

                return {
                    ...state,
                    spheres: newSpheres as any,
                    binaryTree: formatBinaryTree(newBst as any),
                }


            } else if (deleteType === 1) { // 删除的结点有一个子结点
                const { oldIndexes, targetIndexes }: { oldIndexes: number[], targetIndexes: number[] } = payload
                let newSpheres = [...state.spheres];

                // 删除结点：sphere.value=null, binaryTree结点位移
                newSpheres = newSpheres.map((sphere) => {
                    // 如果是待位移的结点位置则赋值为null
                    if (oldIndexes.includes(sphere.sortIndex)) return { ...sphere, value: null }
                    // // 如果是删除结点的位置则赋值为 state.binaryTree[targetIndexes[0]]
                    // else if (sphere.sortIndex === targetIndexes[0]) return { ...sphere, value: state.binaryTree[targetIndexes[0]] }
                    // 如果是目标位置的结点，则更新其值
                    else if (targetIndexes.includes(sphere.sortIndex)) {
                        // let targetIndex = targetIndexes.find((value: number) => value === sphere.sortIndex);
                        return { ...sphere, value: state.binaryTree[sphere.sortIndex] }
                    }
                    return sphere
                })

                // 改变 sortIndex
                newSpheres = newSpheres.map((sphere) => {
                    return { ...sphere, sortIndex: sphere.sortIndexes[sphere.sortIndexes.length - 1] }
                })

                console.log('delete');

                return {
                    ...state,
                    spheres: newSpheres,
                    // binaryTree: formatBinaryTree(newBst),
                }
            } else {
                return {
                    ...state
                }
            }
        }

        case ActionTypes.Add: {
            const { value, index } = payload;
            let newSpheres = [...state.spheres];

            // 找到其父结点坐标及取值
            const fatherIndex = getFatherIndex(index);
            const fatherValue = state.binaryTree[fatherIndex];

            const isLeft = value <= (fatherValue as number) ? true : false;

            // 新结点
            const newNode: IBSTSphere3d = {
                value,
                sortIndex: index,
                sortIndexes: [index]
            };
            // 添加新结点
            newSpheres[index] = newNode;

            newSpheres =  newSpheres.map((sphere) => {
                if (sphere.sortIndex === fatherIndex) {
                    if (isLeft) return { ...sphere, lChildPos: cdnOfNodes[index]}
                    else return {...sphere, rChildPos: cdnOfNodes[index]}
                }
                return sphere
            })
            // 格式化
            newSpheres = formatSpheres(newSpheres);

            let newBst = [...state.binaryTree];
            // 添加新值
            newBst[index] = value
            // 格式化
            newBst = formatBinaryTree(newBst);

            return {
                ...state,
                binaryTree: newBst,
                spheres: newSpheres,
                opeDetails: [...state.opeDetails, {
                    type: OpeDetailTypes.Add, payload: {
                        index: payload.index,
                        value: payload.value,
                        cur: newBst
                    }
                }]
            }
        }

        case ActionTypes.StartPreorder:
            return {
                ...state,
                spheres: state.spheres.map(
                    (item) => ({ ...item, isLock: false })
                ),
                opeDetails: [...state.opeDetails, { type: OpeDetailTypes.PreOrderDetails, payload }]
            }

        case ActionTypes.StartInOrder:
            return {
                ...state,
                spheres: state.spheres.map((item) => ({
                    ...item,
                    isLock: false,
                    activeLeft: false,
                    activeRight: false
                })),
                opeDetails: [...state.opeDetails, { type: OpeDetailTypes.InOrderDetails, payload }]
            }

        case ActionTypes.StartPostOrder:
            return {
                ...state,
                spheres: state.spheres.map((item) => ({
                    ...item,
                    isLock: false,
                    activeLeft: false,
                    activeRight: false
                })),
                opeDetails: [...state.opeDetails, { type: OpeDetailTypes.PostOrderDetails, payload }]
            }

        case ActionTypes.Active:
            return {
                ...state,
                spheres: state.spheres.map((item) => ({
                    ...item,
                    isActive: payload === item.sortIndex
                }))
            }

        case ActionTypes.ActiveLeft:
            return {
                ...state,
                spheres: state.spheres.map((item) => ({
                    ...item,
                    activeLeft: payload === item.sortIndex
                }))
            }

        case ActionTypes.ActiveRight:
            return {
                ...state,
                spheres: state.spheres.map((item) => ({
                    ...item,
                    activeRight: payload === item.sortIndex
                }))
            }

        case ActionTypes.Deactive:
            return {
                ...state,
                spheres: state.spheres.map((item) => ({
                    ...item,
                    isActive: payload === item.sortIndex ? false : item.isActive
                }))
            }

        case ActionTypes.Lock:
            return {
                ...state,
                spheres: state.spheres.map(
                    (item) => payload === item.sortIndex ? { ...item, isLock: true } : { ...item }
                )
            }

        case ActionTypes.UnLock:
            return {
                ...state,
                spheres: state.spheres.map(
                    (item) => (!payload && payload !== 0) ? { ...item, isLock: false } : (payload === item.sortIndex) ? { ...item, isLock: false } : { ...item }
                )
            }

        default:
            return state
    }
}