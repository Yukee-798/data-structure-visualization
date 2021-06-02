
import { Range } from '../../types';
import { randomArr, randomNum, swap } from '../../utils';
import { getFatherIndex } from '../../utils/binaryTree';


// 向二叉堆插入元素
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


export function randomBh(nodeNumsRange: Range, nodeValueRange: Range) {
    const arr = randomArr(randomNum(nodeNumsRange), nodeValueRange)
    const binaryHeap: number[] = [];
    arr.forEach((value) => {
        addToBh(binaryHeap, value);
    })
    return binaryHeap;
}

