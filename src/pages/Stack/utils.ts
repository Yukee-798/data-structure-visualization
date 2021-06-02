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

/** 返回初始化数组的细节 */
export function initSeq(values: number[]) {
    const seq = [];
    seq.push([{ type: ActionTypes.Disappear }])
    seq.push([
        { type: ActionTypes.Generate, payload: values },
        { type: ActionTypes.Appear }])
    return seq;
}

/** input输入的value解析为数组，如果输入的不合法则返回 undefined */
export function parseValue(value: string) {
    // 去掉前后括，然后按照逗号划分，再转换成数字数组
    let parseRes = value.substring(1, value.length - 1).split(/[,，]/g).map(item => +item);
    // console.log(parseRes);

    // 1. 格式不正确：不是类似 [x,xx,x] 这样的格式
    // 2. 元素取值不能是小数 [1.2,3.2,3]
    // 3. 元素不能为空 []

    return parseRes;
}

/** 返回压栈细节 */
export function pushSeq(value: number) {
    let seq = [];
    seq.push([{ type: ActionTypes.Push, payload: value }])
    seq.push([{ type: ActionTypes.Deactive }]);
    return seq;
}
/** 返回弹栈细节 */
export function popSeq() {
    let seq = [];
    seq.push([{ type: ActionTypes.Active }]);
    seq.push([{ type: ActionTypes.Pop }])
    seq.push([{ type: ActionTypes.PopDone }])
    return seq;
}

/** 根据数组长度，计算出第一个 cube 的 position 的 y 坐标 */
export function getStartYPos(arrLen: number): number {
    return -(arrLen - 1) * config.geoBaseDistance / 2;
}