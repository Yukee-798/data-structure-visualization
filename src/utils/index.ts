import { useEffect, useRef, useState } from "react"
import { Range } from "../types";

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
        [ref.current] // Recall only if ref changes
    );
    return [ref, value];
}