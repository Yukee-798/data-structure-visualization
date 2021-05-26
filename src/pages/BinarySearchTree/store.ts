import { ActionTypes, IReducer, OpeDetailTypes } from "../../types";
import { initSpheres, randomBST } from "../../utils/binaryTree";
import { IBSTSphere3dProps } from "./BSTSphere3d/bstSphere3d";

export interface IBSTCube3d extends IBSTSphere3dProps {

}

export interface IState {
    // 表示二叉树当前真实的结构
    binaryTree: (number | null)[];
    // 用来表示每个 sphere 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    spheres: IBSTCube3d[];
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
                    (item) => payload === item.sortIndex ? { ...item, isLock: false } : { ...item }
                )
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            }

        case ActionTypes.RandomDone:
            {
                let newBinaryTree = randomBST();

                const treeToString = newBinaryTree.map((item) => {
                    if (!item) return 'null'
                    return item;
                }).toString();

                return {
                    ...state,
                    binaryTree: newBinaryTree,
                    spheres: initSpheres(newBinaryTree),
                    randomDone: true,
                    opeDetails: [{ type: OpeDetailTypes.Default, payload: treeToString }]
                }
            }

        default:
            return {
                ...state
            }
    }
}