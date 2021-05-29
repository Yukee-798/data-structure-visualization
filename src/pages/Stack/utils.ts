import { ActionTypes } from "../../types";
import { IStackCube } from "./store";
import config from './config'

export function initCubes(values: number[]): IStackCube[] {
    return values.map((value) => ({
        value,
        isActive: false,
        isLock: false
    }))
}

/** 返回压栈细节 */
export function pushSeq(value: number) {
    let seq = [];
    seq.push({ type: ActionTypes.Push, payload: value })
    seq.push({ type: ActionTypes.Deactive });
    return seq;
}
/** 返回弹栈细节 */
export function popSeq() {
    let seq = [];
    seq.push({ type: ActionTypes.Active });
    seq.push({ type: ActionTypes.Pop })
    seq.push({ type: ActionTypes.PopDone })
    return seq;
}

/** 根据数组长度，计算出第一个 cube 的 position 的 y 坐标 */
export function getStartYPos(arrLen: number): number {
    return -(arrLen - 1) * config.geoBaseDistance / 2;
}