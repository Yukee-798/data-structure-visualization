import { ILinkCube } from "../pages/LinkedList/linkedList";
import { ActionTypes, LINK_CUBE_INTERVAL_DISTANCE } from "../types";

/** 根据数组长度，计算出第一个 cube 的 position 的 x 坐标 */
export function getStartPosX(arrLen: number): number {
    return -(arrLen - 1) * LINK_CUBE_INTERVAL_DISTANCE / 2;
}

export function initCubes(values: number[]): ILinkCube[] {
    // 箭头头部的起始位置
    const arrowStartPosX = getStartPosX(values.length) + 2.5;
    return values.map((value, index) => {
        return {
            value,
            isActive: false,
            isLock: false,
            arrowTo: index === values.length - 1 ? null : [arrowStartPosX + (index * LINK_CUBE_INTERVAL_DISTANCE), 0, 0],
            sortIndex: index,
            sortIndexes: [index],
            moveTop: false,
            moveDown: false,
            posY: 0
        }
    })
}

/** 返回头插法细节 */
export function headInsertSeq() {
    const seq = [];
    // 先生成一个激活状态，且在上方的 cube
    seq.push({ type: ActionTypes.HeadInsert })
    // 让这个新的 cube 的箭头指向其右下方的 cube
    seq.push({ type: ActionTypes.ShowArrow })
    // 向下移动该 cube
    seq.push({ type: ActionTypes.MoveDown })
    // 取消激活
    seq.push({ type: ActionTypes.Deactive })
    return seq;
}

/** 返回尾插法细节 */
export function tailInsertSeq() {

}