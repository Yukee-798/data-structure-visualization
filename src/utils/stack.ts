import { IStackCube } from "../pages/Stack/stack";
import { STACK_CUBE_INTERVAL_DISTANCE } from "../types";

export function initCubes(values: number[]): IStackCube[] {
    return values.map((value, index) => ({
        value: value + '',
        isActive: false,
        isLock: false
    }))
}

/** 根据数组长度，计算出第一个 cube 的 position 的 y 坐标 */
export function getStartYPos(arrLen: number): number {
    return -(arrLen - 1) * STACK_CUBE_INTERVAL_DISTANCE / 2;
}