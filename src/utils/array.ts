import { randomNum } from ".";
import { ISortDetail } from "../types";

/* 随机生成长度为 3 ～ 10 的数组 */
export function randomArr(): number[] {
    const arr = [];
    for (let i = 0; i < randomNum(3, 10); i++) {
        arr.push(randomNum(-100, 100));
    }
    return arr;
}




/* 返回冒泡排序细节 */
export function bubbleSortSeq(arr: number[]): ISortDetail[] {
    let backup = [...arr];
    let sortSeq: ISortDetail[] = [];
    for (let i = backup.length - 1; i >= 0; i--) {

        for (let j = 0; j < i; j++) {
            sortSeq.push({ type: 'active', indexes: [j, j + 1] });
            if (backup[j] > backup[j + 1]) {
                let temp = backup[j];
                backup[j] = backup[j + 1];
                backup[j + 1] = temp;
                sortSeq.push({ type: 'swap', indexes: [j, j + 1] });
            }
            sortSeq.push({ type: 'deactive', indexes: [j, j + 1] })
        }
        sortSeq.push({ type: 'lock', indexes: [i] });
    }
    sortSeq.push({ type: 'done' })
    return sortSeq;
}