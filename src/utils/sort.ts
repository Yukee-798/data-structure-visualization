import { randomNum } from ".";
import { ActionTypes } from "../pages/Sort/sort";
import { CUBE_INTERVAL_DISTANCE, ICube } from "../types";

/* 随机生成长度为 3 ～ 10 的数组 */
export function randomArr(): number[] {
    const arr = [];
    for (let i = 0; i < randomNum(3, 10); i++) {
        arr.push(randomNum(3, 40));
    }
    return arr;
}

/* 返回冒泡排序细节 */
export function bubbleSortSeq(arr: number[]) {
    let backup = [...arr];
    let sortSeq = [];
    for (let i = backup.length - 1; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            sortSeq.push({ type: ActionTypes.Active, indexes: [j, j + 1] });
            if (backup[j] > backup[j + 1]) {
                let temp = backup[j];
                backup[j] = backup[j + 1];
                backup[j + 1] = temp;
                sortSeq.push({ type: ActionTypes.Swap, indexes: [j, j + 1] });
            }
            sortSeq.push({ type: ActionTypes.Deactive, indexes: [j, j + 1] })
        }
        sortSeq.push({ type: ActionTypes.Lock, indexes: [i] });
    }
    sortSeq.push({ type: ActionTypes.SortDone })
    return sortSeq;
}

/* 初始化 cubes */
export function initCubes(values: number[]): ICube[] {
    return values.map((value, index) => ({
        value,
        strValue: value + '&' + index,
        isActive: false,
        isLock: false,
        sortIndex: index
    }));
}

/* 根据数组长度，计算出第一个 cube 的 position 的 x 坐标 */
export function getStartXPos(arrLen: number): number {
    return -(arrLen - 1) * CUBE_INTERVAL_DISTANCE / 2;
}