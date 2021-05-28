import { ISortCube } from "./store";
import { ActionTypes } from "../../types";
import config from './config'

/** 初始化 cubes */
export function initCubes(values: number[]): ISortCube[] {
    return values.map((value, index) => ({
        value,
        isActive: false,
        isLock: false,
        disappear: false,
        sortIndexes: [index],
        sortIndex: index
    }));
}

/** 根据数组长度，计算出第一个 cube 的 position 的 x 坐标 */
export function getStartPosX(arrLen: number): number {
    return -(arrLen - 1) * config.geoBaseDistance / 2;
}

/** 传入一组序列，判断其是否有序 */
export function isSorted(values: number[]): boolean {
    return false;
}

/*
    0 1 2 3 4 5 6 7 
    0 1 2 3 x 4 5 6 7

*/

/** 返回向数组插值时，数组位移的细节 */
export function addEleSeq(arr: number[], newEle: number, targetIndex: number) {

    // 记录动画细节
    const seq = [];

    // 记录待位移的元素下标
    const oldIndexes: number[] = [];
    arr.forEach((_, i) => { i >= targetIndex && oldIndexes.push(i) });

    // 记录位移元素的目标下标
    const targetIndexes: number[] = [];
    oldIndexes.forEach((value) => { targetIndexes.push(value + 1) });

    // 先激活需要位移的元素
    seq.push({ type: ActionTypes.Active, payload: oldIndexes });

    // 开始位移，并扩容出现新的下标
    seq.push({
        type: ActionTypes.Move,
        payload: {
            oldIndexes,
            targetIndexes
        }
    });

    // 取消激活
    seq.push({ type: ActionTypes.Deactive, payload: targetIndexes })

    // 在 targetIndex 处添加元素
    seq.push({
        type: ActionTypes.AddDone,
        payload: {
            newEle,
            targetIndex
        }
    });

    return seq;
}

/** 返回向数组删除元素时，数组位移的细节 */
export function deleteEleSeq(arr: number[], targetIndex: number) {

    // 记录动画细节
    const seq = [];

    // 记录待位移的元素下标
    const oldIndexes: number[] = [];
    arr.forEach((_, i) => { i >= targetIndex && oldIndexes.push(i) });

    // 记录位移元素的目标下标
    const targetIndexes: number[] = [];
    oldIndexes.forEach((value) => { targetIndexes.push(value - 1) });

    // 先删除 targetIndex 位置的元素
    seq.push({ type: ActionTypes.Delete, payload: targetIndex });

    // 激活需要位移的元素
    seq.push({ type: ActionTypes.Active, payload: oldIndexes });

    // 开始位移，同时缩容
    seq.push({
        type: ActionTypes.Move,
        payload: {
            oldIndexes,
            targetIndexes
        }
    });

    // 取消激活
    seq.push({ type: ActionTypes.Deactive, payload: targetIndexes })

    // 删除完毕，修改内部的 sortIndex
    seq.push({ type: ActionTypes.DeleteDone, payload: targetIndex })

    return seq;
}

/** 返回冒泡排序细节 */
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
                sortSeq.push({ type: ActionTypes.SwapDone, indexes: [j, j + 1] });
            }
            sortSeq.push({ type: ActionTypes.Deactive, indexes: [j, j + 1] })
        }
        sortSeq.push({ type: ActionTypes.Lock, indexes: [i] });
    }
    sortSeq.push({ type: ActionTypes.SortDone })
    return sortSeq;
}

/** 返回选择排序细节 */
export function selectSortSeq(arr: number[]) {
    let backup = [...arr];
    let sortSeq = [];
    for (let i = backup.length - 1; i >= 0; i--) {
        let max = -Infinity;
        let indexOfMax = -1;
        for (let j = 0; j <= i; j++) {
            sortSeq.push({ type: ActionTypes.Active, indexes: [j] });
            if (backup[j] > max) {
                sortSeq.push({ type: ActionTypes.UnLock, indexes: [indexOfMax] })
                max = backup[j];
                indexOfMax = j;
                sortSeq.push({ type: ActionTypes.Lock, indexes: [j] })
            }
            sortSeq.push({ type: ActionTypes.Deactive, indexes: [j] });
        }
        sortSeq.push({ type: ActionTypes.Lock, indexes: [indexOfMax] })
        let temp = backup[i];
        backup[i] = max;
        backup[indexOfMax] = temp;
        sortSeq.push({ type: ActionTypes.Swap, indexes: [indexOfMax, i] })
        sortSeq.push({ type: ActionTypes.SwapDone, indexes: [indexOfMax, i] });
    }
    sortSeq.push({ type: ActionTypes.SortDone });
    return sortSeq
}

/** 返回快速排序细节 */
export function quickSortSeq(arr: number[], l: number, r: number, sortSeq: any[]) {
    if (l >= r) return;

    let i = l - 1, j = r + 1, x = arr[l + r >> 1];
    while (i < j) {
        do {
            i++;
            sortSeq.push({ type: ActionTypes.Active, indexes: [i] });
            sortSeq.push({ type: ActionTypes.Deactive, indexes: [i] });
        } while (arr[i] < x);
        // sortSeq.push({ type: ActionTypes.Lock, indexes: [i] });

        do {
            j--;
            sortSeq.push({ type: ActionTypes.Active, indexes: [j] });
            sortSeq.push({ type: ActionTypes.Deactive, indexes: [j] });
        } while (arr[j] > x);
        // sortSeq.push({ type: ActionTypes.Lock, indexes: [j] });

        if (i < j) {
            sortSeq.push({ type: ActionTypes.Swap, indexes: [i, j] })
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            sortSeq.push({ type: ActionTypes.SwapDone, indexes: [i, j] });
        }
    }
    quickSortSeq(arr, l, j, sortSeq);
    quickSortSeq(arr, j + 1, r, sortSeq);
}



