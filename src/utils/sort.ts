import { ISortCube } from "../pages/Sort/sort";
import { ActionTypes, SORT_CUBE_INTERVAL_DISTANCE } from "../types";

/** 初始化 cubes */
export function initCubes(values: number[]): ISortCube[] {
    return values.map((value, index) => ({
        value,
        strValue: value + '&' + index,
        isActive: false,
        isLock: false,
        sortIndex: index
    }));
}

/** 根据数组长度，计算出第一个 cube 的 position 的 x 坐标 */
export function getStartXPos(arrLen: number): number {
    return -(arrLen - 1) * SORT_CUBE_INTERVAL_DISTANCE / 2;
}
/** 传入一组序列，判断其是否有序 */
export function isSorted(values: number[]): boolean {
    return false;
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



