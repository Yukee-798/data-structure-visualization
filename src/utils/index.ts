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