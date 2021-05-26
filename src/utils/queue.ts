import { v4 as uuidv4 } from 'uuid';
import { IQueueCube } from "../pages/Queue/store";
import { ActionTypes, QUEUE_CUBE_INTERVAL_DISTANCE } from "../types";

/** 根据数组长度，计算出第一个 cube 的 position 的 x 坐标 */
export function getStartPosX(arrLen: number): number {
    return -(arrLen - 1) * QUEUE_CUBE_INTERVAL_DISTANCE / 2;
}

export function initCubes(values: number[]): IQueueCube[] {
    return values.map((value) => ({
        value,
        isActive: false,
        isLock: false,
        key: uuidv4()
    }))
}

/** 返回入队细节 */
export function enqueueSeq(value: number, arrLen: number) {
    let seq = [];
    // 入队时自动激活
    seq.push({ type: ActionTypes.Enqueue, payload: value })
    seq.push({ type: ActionTypes.Deactive, payload: arrLen });
    return seq;
}

/** 返回出队细节 */
export function dequeueSeq() {
    let seq = [];
    // seq.push({ type: ActionTypes.Active, payload: 0 });
    seq.push({ type: ActionTypes.Disappear, payload: 0 });
    seq.push({ type: ActionTypes.Dequeue })
    return seq;
}