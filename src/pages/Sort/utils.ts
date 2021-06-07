import { ISortCube } from "./store";
import { ActionTypes, SeqType } from "../../types";
import config from './config'
import { judgeSorted } from "../../utils/array";

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

/** input输入的value解析为数组，如果输入的不合法则返回 undefined */
export function parseValue(value: string) {
    // 去掉前后括，然后按照逗号划分，再转换成数字数组
    let parseRes = value.substring(1, value.length - 1).split(/[,，]/g).map(item => +item);
    // console.log(parseRes);

    // 1. 格式不正确：不是类似 [x,xx,x] 这样的格式
    // 2. 元素取值不能是小数 [1.2,3.2,3]
    // 3. 元素不能为空 []

    if (/\[\s*\]/g.test(value)) return '数据不能为空'
    return parseRes;
}

/** 返回初始化数组的细节 */
export function initSeq(values: number[]): SeqType {
    const seq = [];
    seq.push([{ type: ActionTypes.Disappear }])
    seq.push([
        { type: ActionTypes.Generate, payload: values },
        { type: ActionTypes.Appear }])
    return seq;
}

/** 返回向数组插值时，数组位移的细节 */
export function addEleSeq(arr: number[], newEle: number, targetIndex: number): SeqType {
    // 记录动画细节
    const seq = [];

    if (targetIndex === arr.length) {
        // 单独处理尾部添加

        // 在 targetIndex 处添加元素
        seq.push([{
            type: ActionTypes.AddDone,
            payload: {
                newEle,
                targetIndex
            }
        }]);

    } else {
        // 记录待位移的元素下标
        const oldIndexes: number[] = [];
        arr.forEach((_, i) => { i >= targetIndex && oldIndexes.push(i) });

        // 记录位移元素的目标下标
        const targetIndexes: number[] = [];
        oldIndexes.forEach((value) => { targetIndexes.push(value + 1) });

        // 先激活需要位移的元素
        seq.push([{ type: ActionTypes.Active, payload: oldIndexes }]);

        // 开始位移，并扩容出现新的下标
        seq.push([{
            type: ActionTypes.Move,
            payload: {
                oldIndexes,
                targetIndexes
            }
        }]);

        // 取消激活
        seq.push([{ type: ActionTypes.Deactive, payload: targetIndexes }])

        // 在 targetIndex 处添加元素
        seq.push([{
            type: ActionTypes.AddDone,
            payload: {
                newEle,
                targetIndex
            }
        }]);
    }

    return seq;
}

/** 返回向数组删除元素时，数组位移的细节 */
export function deleteEleSeq(arr: number[], targetIndex: number): SeqType {

    // 记录动画细节
    const seq = [];

    // 记录待位移的元素下标
    const oldIndexes: number[] = [];
    arr.forEach((_, i) => { i >= targetIndex && oldIndexes.push(i) });

    // 记录位移元素的目标下标
    const targetIndexes: number[] = [];
    oldIndexes.forEach((value) => { targetIndexes.push(value - 1) });

    // 先删除 targetIndex 位置的元素
    seq.push([{ type: ActionTypes.Delete, payload: targetIndex }]);

    // 激活需要位移的元素
    seq.push([{ type: ActionTypes.Active, payload: oldIndexes }]);

    // 开始位移，同时缩容
    seq.push([{
        type: ActionTypes.Move,
        payload: {
            oldIndexes,
            targetIndexes
        }
    }]);

    // 取消激活
    seq.push([{ type: ActionTypes.Deactive, payload: targetIndexes }])

    // 删除完毕，修改内部的 sortIndex
    seq.push([{ type: ActionTypes.DeleteDone, payload: targetIndex }])

    return seq;
}

/** 返回冒泡排序细节 */
export function bubbleSortSeq(arr: number[]): SeqType {
    if (judgeSorted(arr)) return [[{ type: ActionTypes.Lock }]];
    let backup = [...arr];
    let sortSeq = [];
    for (let i = backup.length - 1; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            sortSeq.push([{ type: ActionTypes.Active, payload: [j, j + 1] }]);
            if (backup[j] > backup[j + 1]) {
                let temp = backup[j];
                backup[j] = backup[j + 1];
                backup[j + 1] = temp;
                sortSeq.push([{ type: ActionTypes.Swap, payload: [j, j + 1] }]);
                sortSeq.push([{ type: ActionTypes.SwapDone, payload: [j, j + 1] }]);
            }
            sortSeq.push([{ type: ActionTypes.Deactive, payload: [j, j + 1] }])
        }
        sortSeq.push([{ type: ActionTypes.Lock, payload: [i] }]);
    }
    sortSeq.push([{ type: ActionTypes.SortDone }])
    return sortSeq;
}

/** 返回选择排序细节 */
export function selectSortSeq(arr: number[]): SeqType {
    if (judgeSorted(arr)) return [[{ type: ActionTypes.Lock }]];

    let backup = [...arr];
    let sortSeq = [];
    for (let i = backup.length - 1; i >= 0; i--) {
        let max = -Infinity;
        let indexOfMax = -1;
        for (let j = 0; j <= i; j++) {
            sortSeq.push([{ type: ActionTypes.Active, payload: [j] }]);
            if (backup[j] > max) {
                sortSeq.push([{ type: ActionTypes.UnLock, payload: [indexOfMax] }])
                max = backup[j];
                indexOfMax = j;
                sortSeq.push([{ type: ActionTypes.Lock, payload: [j] }])
            }
            sortSeq.push([{ type: ActionTypes.Deactive, payload: [j] }]);
        }
        sortSeq.push([{ type: ActionTypes.Lock, payload: [indexOfMax] }])
        let temp = backup[i];
        backup[i] = max;
        backup[indexOfMax] = temp;
        sortSeq.push([{ type: ActionTypes.Swap, payload: [indexOfMax, i] }])
        sortSeq.push([{ type: ActionTypes.SwapDone, payload: [indexOfMax, i] }]);
    }
    sortSeq.push([{ type: ActionTypes.SortDone }]);
    return sortSeq
}

/** 返回归并排序细节 */
export function mergeSortSeq(arr: number[], l: number, r: number, seq: SeqType) {
    if (judgeSorted(arr)) return seq.push([{ type: ActionTypes.Lock }]);

    if (l >= r) return;
    let tmp = [...arr];

    let mid = l + r >> 1;
    mergeSortSeq(arr, l, mid, seq);
    mergeSortSeq(arr, mid + 1, r, seq);

    let k = 0, i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) {
            seq.push([{ type: ActionTypes.Swap, payload: [k, i] }])
            seq.push([{ type: ActionTypes.SwapDone, payload: [k, i] }])
            tmp[k++] = arr[i++];
            
        }
        else {
            seq.push([{ type: ActionTypes.Swap, payload: [k, i] }])
            seq.push([{ type: ActionTypes.SwapDone, payload: [k, i] }])
            tmp[k++] = arr[j++];
        }
    }

    while (i <= mid) {
        seq.push([{ type: ActionTypes.Swap, payload: [k, i] }])
        seq.push([{ type: ActionTypes.SwapDone, payload: [k, i] }])
        tmp[k++] = arr[i++];
    }
    while (j <= r) {
        seq.push([{ type: ActionTypes.Swap, payload: [k, i] }])
        seq.push([{ type: ActionTypes.SwapDone, payload: [k, i] }])
        tmp[k++] = arr[j++];
    }

    // for (i = l, j = 0; i <= r; i++, j++) arr[i] = tmp[j];

}

/** 返回快速排序细节 */
export function quickSortSeq(arr: number[], l: number, r: number, sortSeq: SeqType) {
    if (judgeSorted(arr)) return sortSeq.push([{ type: ActionTypes.Lock }]);
    if (l >= r) return;

    let i = l - 1, j = r + 1, x = arr[l + r >> 1];
    while (i < j) {
        do {
            i++;
            sortSeq.push([{ type: ActionTypes.Active, payload: [i] }]);
            sortSeq.push([{ type: ActionTypes.Deactive, payload: [i] }]);
        } while (arr[i] < x);
        // sortSeq.push({ type: ActionTypes.Lock, payload: [i] });

        do {
            j--;
            sortSeq.push([{ type: ActionTypes.Active, payload: [j] }]);
            sortSeq.push([{ type: ActionTypes.Deactive, payload: [j] }]);
        } while (arr[j] > x);
        // sortSeq.push({ type: ActionTypes.Lock, payload: [j] });

        if (i < j) {
            sortSeq.push([{ type: ActionTypes.Swap, payload: [i, j] }])
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            sortSeq.push([{ type: ActionTypes.SwapDone, payload: [i, j] }]);
        }
    }
    quickSortSeq(arr, l, j, sortSeq);
    quickSortSeq(arr, j + 1, r, sortSeq);
}



