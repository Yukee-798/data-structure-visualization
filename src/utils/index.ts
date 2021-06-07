import { useEffect, useRef, useState } from "react"
import { ActionTypes, IAction, Range, SeqType } from "../types";

/** 判断一个值是否是数字 */
export function isNum(value: any) {
    return typeof value === 'number' && !isNaN(value);
}

/** 交换数组两个元素 */
export function swap<T>(arr: T[], i1: number, i2: number) {
    const temp = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = temp;
}

/** 执行动画细节数组 */
export function excuteSeq(seq: SeqType, speed: number, dispatch: React.Dispatch<IAction>) {
    return new Promise((resolve) => {
        dispatch({ type: ActionTypes.Loading })
        seq.forEach((event, i) => {
            setTimeout(() => {
                event.forEach((e) => { dispatch(e) })
                if (i === seq.length - 1) {
                    resolve('Seq has been excuted.')
                    dispatch({ type: ActionTypes.CancelLoading })
                }
            }, i * speed)
        })
    })
}

/** 随机生成一个 start ~ end 的整数 */
export function randomNum(range: Range): number {
    return +(Math.random() * (range[1] - range[0]) + range[0]).toFixed(0);
}

/** 随机生成指定长度且无重复的数组 */
export function randomArr(length: number, valueRange: Range): number[] {
    const arr: number[] = [];
    for (let i = 0; i < length; i++) {
        let value = randomNum(valueRange);
        while (arr.includes(value)) {
            value = randomNum(valueRange);
        }
        arr.push(value);
    }
    return arr;
}

/** 判断某个元素是否 hover */
export function useHover() {
    const [value, setValue] = useState(false);
    const ref = useRef<any>();
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);
    useEffect(
        () => {
            const node = ref.current;
            if (node) {
                node.addEventListener("mouseover", handleMouseOver);
                node.addEventListener("mouseout", handleMouseOut);
                return () => {
                    node.removeEventListener("mouseover", handleMouseOver);
                    node.removeEventListener("mouseout", handleMouseOut);
                };
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ref.current] // Recall only if ref changes
    );
    return [ref, value];
}