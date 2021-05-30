import { ActionTypes, IReducer, OpeDetailTypes } from "../../types";
import { formatBinaryTree, formatSpheres, getFatherIndex, initSpheres, randomBST, treeToString } from "./utils";
import { IBSTSphere3dProps } from "./BSTSphere3d/bstSphere3d";
import config from "./config";

export interface IBSTSphere3d extends IBSTSphere3dProps { }

export interface IState {
    // 表示二叉树当前真实的结构
    binaryTree: (number | null)[];
    // 用来表示每个 sphere 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    spheres: IBSTSphere3d[];
    randomDone: boolean;
    opeDetails: any[];
}

export const initState: IState = {
    binaryTree: [],
    spheres: [],
    opeDetails: [],
    randomDone: true,
}

export const reducer: IReducer<IState> = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case ActionTypes.Disappear: {

            let newSpheres = [...state.spheres];
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

            let newBst = [...state.binaryTree];
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
        }


        case ActionTypes.Delete: {
            let newSpheres = [...state.spheres];
            newSpheres = newSpheres.map((sphere) => {
                if (sphere.sortIndex === payload) return { ...sphere, value: null }
                return sphere;
            })

            let newBst = [...state.binaryTree];
            newBst[payload] = null;

            return {
                ...state,
                spheres: newSpheres,
                binaryTree: formatBinaryTree(newBst),
            }
        }

        case ActionTypes.Add: {
            const { value, index } = payload;
            let newSpheres = [...state.spheres];
            // 新结点
            const newNode: IBSTSphere3d = {
                value,
                sortIndex: index
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
                    (item) => !payload ? { ...item, isLock: false } : (payload === item.sortIndex) ? { ...item, isLock: false } : { ...item }
                )
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            }

        case ActionTypes.RandomDone: {
            let newBinaryTree = randomBST(config.geoNumRange, config.geoValueRange, config.maxDeepth);

            return {
                ...state,
                binaryTree: formatBinaryTree(newBinaryTree),
                spheres: initSpheres(newBinaryTree),
                randomDone: true,
                opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString(newBinaryTree) }]
            }
        }

        default:
            return state
    }
}