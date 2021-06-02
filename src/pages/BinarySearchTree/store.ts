import { ActionTypes, IBaseState, IReducer, OpeDetailTypes } from "../../types";
import { formatBinaryTree, formatSpheres, getChildrenIndexes, getFatherIndex, initSpheres, judgeNode, treeToString } from "../../utils/binaryTree";
import { IBSTSphere3dProps } from "./BSTSphere3d/bstSphere3d";
import config, { cdnOfNodes } from "./config";
import { randomBST } from "./utils";

export interface IBSTSphere3d extends IBSTSphere3dProps { }

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
                    let childIndex = childrenIndexes[0] || childrenIndexes[1]

                    let fatherIndex = getFatherIndex(payload);
                    // 判断是父结点左连线还是右连线(这里因为是二叉搜索树所以可以直接通过数值大小来判断)
                    let isLeft = (state.binaryTree[fatherIndex] as number) >= (state.binaryTree[payload] as number)

                    // 把被删除的结点的子结点的 sortIndexes 中 push 被删除结点的 sortIndex，并且让其父节点与之的连线也消失
                    newSpheres = newSpheres.map((sphere) => {
                        let newSphere = { ...sphere };
                        if (sphere.sortIndex === fatherIndex) {
                            if (isLeft) newSphere.lChildPos = null;
                            else newSphere.rChildPos = null;
                        } else if (sphere.sortIndex === childIndex) {
                            newSphere.sortIndexes.push(payload);
                        }
                        return newSphere;
                    })
                    // 被删除结点的子结点移动到该位置
                    newBst[payload] = state.binaryTree[childIndex];

                    // 之前子结点变为 null
                    newBst[childIndex] = null;

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

                } else {
                    return {
                        ...state
                    }
                }
            }
        }

        case ActionTypes.Move: {
            const { oldSortIndex, targetIndex } = payload;
            const newSperes = [...state.spheres];

            // 子结点
            const sphere = newSperes.find((sphere) => sphere.sortIndex === oldSortIndex);
            // 子结点移动到被删除结点的位置
            sphere?.sortIndexes.push(targetIndex)

            return {
                ...state,
                spheres: newSperes
            }
        }

        case ActionTypes.Delete: {
            // 判断删除的结点类型
            const deleteType = judgeNode(state.binaryTree, payload);
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


                /*

                [32,27,56,null,null,54,null,null,null,null,null,null,55]
                [32,27,54,n,n,n,55]

                */

            } else if (deleteType === 1) { // 删除的结点有一个子结点
                // 获取其父结点的下标
                let fatherIndex = getFatherIndex(payload);
                // 获取其子结点的下标
                let childrenIndexes = getChildrenIndexes(state.binaryTree, payload);
                let childIndex = childrenIndexes[0] && childrenIndexes[1];

                // newSpheres = newSpheres.map((sphere) => {
                //     const newSphere = { ...sphere };
                //     // 真正意义上删除该结点
                //     if (sphere.sortIndex === payload) newSphere.value = null;
                //     // 将其子结点 sortIndex 设置为该被删除的结点的 sortIndex
                //     else if (sphere.sortIndex === childIndex) newSphere.sortIndex = payload;
                //     // 连接其父结点和被删除位置的连线
                //     else if (sphere.sortIndex === fatherIndex) {
                //         // 判断是父结点左连线还是右连线(这里因为是二叉搜索树所以可以直接通过数值大小来判断)
                //         let isLeft = (state.binaryTree[fatherIndex] as number) >= (state.binaryTree[payload] as number)
                //         if (isLeft) newSphere.lChildPos = cdnOfNodes[payload]
                //         else newSphere.rChildPos = cdnOfNodes[payload]
                //     }
                //     return newSphere;
                // })

                // 被删除结点的子结点移动到该位置
                // newBst[payload] = state.binaryTree[childIndex];

                // 之前子结点变为 null
                // newBst[childIndex] = null;

                return {
                    ...state,
                    // spheres: newSpheres,
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
            // 新结点
            const newNode: IBSTSphere3d = {
                value,
                sortIndex: index,
                sortIndexes: [index]
            };
            // 添加新结点
            newSpheres[index] = newNode;
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