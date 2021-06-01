import { ActionTypes, IReducer } from "../../types";
import { IBSTSphere3dProps } from "../BinarySearchTree/BSTSphere3d/bstSphere3d";

export interface IAVLTreeSphere3d extends IBSTSphere3dProps { }

export interface IState {
    // 表示二叉树当前真实的结构
    binaryTree: (number | null)[];
    // 用来表示每个 sphere 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    spheres: IAVLTreeSphere3d[];
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
        case ActionTypes.Active:
            return {
                ...state,
            }

        case ActionTypes.Deactive:
            return {
                ...state,
            }

        case ActionTypes.Lock:
            return {
                ...state,
            }

        case ActionTypes.UnLock:
            return {
                ...state,
            }


        // case ActionTypes.Add:

        // case ActionTypes.Delete:

        case ActionTypes.RandomDone:
            {
                return {
                    ...state,
                    randomDone: true
                }
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false
            };

        // case ActionTypes.Search:

        default:
            return state;
    }
}