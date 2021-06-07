
import { ActionTypes, Range, SeqType } from '../../types';
import { randomArr, randomNum, swap } from '../../utils';
import { getFatherIndex } from '../../utils/binaryTree';


/** 向二叉堆插入元素 */
function addToBh(binaryHeap: number[], nodeV: number) {
    binaryHeap.push(nodeV);

    // 该新结点的下标
    let nodeIndex = binaryHeap.length - 1;
    // 获取该新结点的父结点
    let fatherIndex = getFatherIndex(nodeIndex);

    // 如果该父结点存在，且父结点的值小于这个新结点，则交换它们的位置 
    while (fatherIndex >= 0 && binaryHeap[fatherIndex] < binaryHeap[nodeIndex]) {
        swap(binaryHeap, fatherIndex, nodeIndex);

        // 更新该结点下标
        nodeIndex = fatherIndex;
        // 更新该结点的父结点下标
        fatherIndex = getFatherIndex(nodeIndex);
    }
}


/** 向二叉堆添加元素的细节 */
export function addSeq(binaryHeap: number[], nodeV: number) {
    const seq: SeqType = [];
    const temp = [...binaryHeap];
    temp.push(nodeV);

    seq.push([{type: ActionTypes.Add, payload: nodeV}])


    // 该新结点的下标
    let nodeIndex = temp.length - 1;
    // 获取该新结点的父结点
    let fatherIndex = getFatherIndex(nodeIndex);

    // 如果该父结点存在，且父结点的值小于这个新结点，则交换它们的位置 
    while (fatherIndex >= 0 && temp[fatherIndex] < temp[nodeIndex]) {
        swap(temp, fatherIndex, nodeIndex);
        seq.push([{ type: ActionTypes.Active, payload: nodeIndex }, { type: ActionTypes.Active, payload: fatherIndex }])
        seq.push([{ type: ActionTypes.Swap, payload: [nodeIndex, fatherIndex] }])
        seq.push([{ type: ActionTypes.Deactive, payload: nodeIndex }, { type: ActionTypes.Deactive, payload: fatherIndex }])
        seq.push([{ type: ActionTypes.SwapDone, payload: [nodeIndex, fatherIndex] }])


        // 更新该结点下标
        nodeIndex = fatherIndex;
        // 更新该结点的父结点下标
        fatherIndex = getFatherIndex(nodeIndex);
    }
    return seq;
}


/** 随机生成二叉堆的细节  */
export function randomBh(nodeNumsRange: Range, nodeValueRange: Range) {
    const arr = randomArr(randomNum(nodeNumsRange), nodeValueRange)
    const binaryHeap: number[] = [];
    arr.forEach((value) => {
        addToBh(binaryHeap, value);
    })
    return binaryHeap;
}

