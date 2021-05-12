import { useEffect, useRef, useState } from "react"

// 根据传入的时间获取多少时间前发布的
export function getTime(time: string): string {
    const minutes = 1000 * 60
    const hours = minutes * 60
    const days = hours * 24
    const months = days * 30
    const years = days * 365
    let res: string = '刚刚'
    let createTime = Date.parse(time)
    let nowTime = Date.parse((new Date()).toString())
    let subTime = nowTime - createTime
    let y = subTime / years
    let d = subTime / days
    let mon = subTime / months
    let h = subTime / hours
    let m = subTime / minutes
    const dateArr = [
        { time: y, des: '年之前' },
        { time: mon, des: '个月之前' },
        { time: d, des: '天之前' },
        { time: h, des: '小时之前' },
        { time: m, des: '分钟之前' }
    ]
    for (let i = 0; i < dateArr.length; i++) {
        if (dateArr[i].time > 1) {
            res = Math.round(dateArr[i].time) + dateArr[i].des
            break
        }
    }
    return res
}

/* 随机生成一个 start ~ end 的整数 */
export function randomNum(start: number, end: number): number {
    return +(Math.random() * (end - start) + start).toFixed(0);
}

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

/*
    const data = [
        [
            {
                src:
                tag:
                title:
                type:
                onClick
            },
            {},
            {},
            {}
        ],
        [
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {},
            {},
            {}
        ]
    ]
*/

/*
0000   0
1111   1
2222   2
3      3

*/

// export function getHomeItemData(): IHomeItemProps[][] {
//     let length = DataStrucTypes.Stack as number + 1;
    
//     const data: IHomeItemProps[][] = [];
//     for (let i = 0; i < Math.ceil(data.length / 4); i++) {
//         data.push(new Array<IHomeItemProps>(4).map((item, i) => ({

//         })))
//     }
    
// }