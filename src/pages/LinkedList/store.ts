import { ActionTypes, IGeometryProps, IReducer, OpeDetailTypes } from "../../types";
import { randomArr, randomNum } from "../../utils";
import { getStartPosX, initCubes } from './utils'
import config from "./config";

export interface ILinkCube extends IGeometryProps {
    /** 该cube即将经历或者已经历过的所有位置 */
    sortIndexes: number[];
    /** 该cube的当前位置 */
    sortIndex: number;
    /** 从该cube开始，箭头指向的位置 */
    arrowTo: any;
    /** 是否让该元素上移 */
    moveTop: boolean;
    /** 元素的初始Y坐标 */
    posY: number;
    /** 是否让该元素下移 */
    moveDown: boolean;
}

export interface IState {
    // 用来表示数组中各值的实时位置
    values: number[];
    // 用来表示每个 cube 的属性，其元素位置无意义，其中 sortIndex 才是对应的 values 的下标
    cubes: ILinkCube[];
    // 是否排序完毕
    sortDone: boolean;
    // 是否随机化完毕
    randomDone: boolean;
    // 第一个cube的起始x坐标
    startPosX: number;
    // 记录当前操作的细节
    opeDetails: { type: OpeDetailTypes, payload?: any }[]
}


export const initState: IState = {
    values: [],
    cubes: [],
    sortDone: true,
    randomDone: true,
    startPosX: 0,
    opeDetails: []
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

        case ActionTypes.HeadInsert:
            {
                // 生成一个激活的 cube
                const newCube: ILinkCube = {
                    arrowTo: null,
                    moveDown: false,
                    moveTop: true,
                    posY: 2,
                    sortIndex: 0,
                    sortIndexes: [0],
                    value: randomNum(config.geoValueRange),
                    isActive: true
                }

                const newCubes = state.cubes.map((item) => {
                    return {
                        ...item,
                        sortIndexes: [...item.sortIndexes, item.sortIndex + 1]
                    }
                })

                newCubes.push(newCube);

                let newOpeDetail;

                return {
                    ...state,
                    cubes: newCubes,
                    // opeDetails: newOpeDetail ? [...state.opeDetails, newOpeDetail] : [...state.opeDetails]
                }
            }

        // case ActionTypes.Add:

        // case ActionTypes.Delete:

        case ActionTypes.RandomDone:
            {
                let newValues = randomArr(randomNum(config.geoNumRange), config.geoValueRange);
                let newStartPosX = getStartPosX(newValues.length);
                return {
                    ...state,
                    cubes: initCubes(newValues),
                    values: newValues,
                    randomDone: true,
                    startPosX: newStartPosX
                }
            }

        case ActionTypes.Random:
            return {
                ...state,
                randomDone: false,
                opeDetails: []
            };

        // case ActionTypes.Search:

        default:
            return state;
    }
}