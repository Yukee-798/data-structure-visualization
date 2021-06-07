import { randomArr, randomNum } from '../../utils';
import { ActionTypes, Range } from '../../types';
import { getChildrenIndexes, getDeepthByNodeIndex, getLChildValue, getRChildValue, getSubTree, judgeNode, setLChild, setRChild } from '../../utils/binaryTree';
import config from './config';

/** 为二叉搜索树添加结点 */
function addToBST(bst: (number | null)[], indexOfRoot: number, nodeV: number) {
    // 传入的 bst 必须有一个根结点
    if (bst.length === 0) throw new Error('the length of bst is 0');

    if (!bst[indexOfRoot] && bst[indexOfRoot] !== 0) return;

    // 判断传入结点的值和当前子树根结点的值的关系
    if (nodeV > (bst as number[])[indexOfRoot]) {
        // 当前结点的右孩子不存在，则直接挂上去
        if (!getRChildValue(bst, indexOfRoot)) {
            setRChild(bst, indexOfRoot, nodeV);
        } else {
            addToBST(bst, indexOfRoot * 2 + 2, nodeV);
        }
    } else {
        // 当前结点的左孩子不存在，则直接挂上去
        if (!getLChildValue(bst, indexOfRoot)) {
            setLChild(bst, indexOfRoot, nodeV);
        } else {
            addToBST(bst, indexOfRoot * 2 + 1, nodeV);
        }
    }
}

/**
 * @param nodeNumsRange 结点数量范围
 * @param maxDeepth 二叉树的最大层数(从0开始计数)
 * @returns 返回二叉搜索数的顺序存储结构
 */
export function randomBST(nodeNumsRange: Range, nodeValueRange: Range, maxDeepth: number) {
    // 初始化 cache
    let cache = new Array(500);

    // 如果生成的二叉搜索树的层数大于了maxDeepth则重新生成
    while (getDeepthByNodeIndex(cache.length - 1) > maxDeepth) {
        const arr = randomArr(randomNum(nodeNumsRange), nodeValueRange);
        cache.fill(null);
        cache[0] = randomNum(nodeValueRange);

        // 用 arr 向 cache 中添加结点
        arr.forEach((value) => {
            addToBST(cache, 0, value)
        })

        // 找到 cache 中最后一个不为 null 的元素的下标
        for (let i = 500; i >= 0; i--) {
            if (cache[i]) {
                cache.length = i + 1;
                break;
            }
        }
    }
    return cache;
}

/** 获取向二叉搜索树添加结点的细节 */
export function addNodeSeq(bst: any[], indexOfRoot: number, nodeV: number, seq: any[]) {
    // 传入的 bst 必须有一个根结点
    if (bst.length === 0) throw new Error('the length of bst is 0');

    if (!bst[indexOfRoot] && bst[indexOfRoot] !== 0) return;

    seq.push([{ type: ActionTypes.Active, payload: indexOfRoot }])
    seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot }])

    // 判断传入结点的值和当前子树根结点的值的关系
    if (nodeV > bst[indexOfRoot]) {
        // 当前结点的右孩子不存在，并且添加新结点后的二叉树层数小于 maxDeepth，则挂上去
        if (!getRChildValue(bst, indexOfRoot) && getDeepthByNodeIndex(indexOfRoot * 2 + 2) <= config.maxDeepth) {
            seq.push([{
                type: ActionTypes.Add,
                payload: { value: nodeV, index: indexOfRoot * 2 + 2 }
            }])
        } else {
            addNodeSeq(bst, indexOfRoot * 2 + 2, nodeV, seq);
        }
    } else {
        // 当前结点的左孩子不存在，则直接挂上去
        if (!getLChildValue(bst, indexOfRoot) && getDeepthByNodeIndex(indexOfRoot * 2 + 1) <= config.maxDeepth) {
            seq.push([{
                type: ActionTypes.Add,
                payload: { value: nodeV, index: indexOfRoot * 2 + 1 }
            }])
        } else {
            addNodeSeq(bst, indexOfRoot * 2 + 1, nodeV, seq);
        }
    }
}

/** 获取向二叉树删除结点的细节 */
export function deleteNodeSeq(bst: any[], targetIndex: number, indexOfRoot: number, seq: any[]) {

    // 传入的 bst 必须有一个根结点
    if (bst.length === 0) throw new Error('the length of bst is 0');

    if (!bst[indexOfRoot]) return;

    seq.push([{ type: ActionTypes.Active, payload: indexOfRoot }])
    seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot }])

    if (judgeNode(bst, targetIndex) === 0) {
        // 如果删除的结点是叶子结点
        // 判断传入结点的值和当前子树根结点的值的关系
        if (bst[targetIndex] > bst[indexOfRoot]) {
            // 如果传入的值大于当前子树根结点的值
            // 则看其右子树
            if (getRChildValue(bst, indexOfRoot) === bst[targetIndex]) {
                // 如果右结点等于nodeV则删除
                seq.push([{ type: ActionTypes.Active, payload: indexOfRoot * 2 + 2 }])
                seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 2 }]);
                seq.push([{ type: ActionTypes.Disappear, payload: indexOfRoot * 2 + 2 }])
                seq.push([{ type: ActionTypes.Delete, payload: indexOfRoot * 2 + 2 }])
            } else {
                // 否则递归搜索其右子树
                deleteNodeSeq(bst, targetIndex, indexOfRoot * 2 + 2, seq);
            }

        } else if (bst[targetIndex] < bst[indexOfRoot]) {
            // 如果传入的值小于当前子树根结点的值
            // 则看其左子树
            if (getLChildValue(bst, indexOfRoot) === bst[targetIndex]) {
                // 如果左结点等于nodeV则删除
                seq.push([{ type: ActionTypes.Active, payload: indexOfRoot * 2 + 1 }])
                seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 1 }])
                seq.push([{ type: ActionTypes.Disappear, payload: indexOfRoot * 2 + 1 }])
                seq.push([{ type: ActionTypes.Delete, payload: indexOfRoot * 2 + 1 }])
            } else {
                // 否则递归搜索其右子树
                deleteNodeSeq(bst, targetIndex, indexOfRoot * 2 + 1, seq);
            }
        } else {
            // 如果当前结点等于nodeV则删除
            seq.push([{ type: ActionTypes.Active, payload: indexOfRoot }])
            seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot }])
            seq.push([{ type: ActionTypes.Disappear, payload: indexOfRoot }])
            seq.push([{ type: ActionTypes.Delete, payload: indexOfRoot }])
        }
    } else if (judgeNode(bst, targetIndex) === 1) {
        // 如果删除的结点有一个子结点
        // 判断删除结点的值和当前子树根结点的值的关系
        if (bst[targetIndex] > bst[indexOfRoot]) {
            // 如果删除的值大于当前子树根结点的值
            // 则看其右子树
            if (getRChildValue(bst, indexOfRoot) === bst[targetIndex]) {
                // 如果右结点等于nodeV则删除
                seq.push([{ type: ActionTypes.Active, payload: indexOfRoot * 2 + 2 }])
                seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 2 }]);
                seq.push([{ type: ActionTypes.Disappear, payload: indexOfRoot * 2 + 2 }]);

                // 获取删除结点的子结点
                const childIndex = getChildrenIndexes(bst, indexOfRoot * 2 + 2)[0] || getChildrenIndexes(bst, indexOfRoot * 2 + 2)[1];
                // 获取以这个子结点为根结点的子树的所有结点下标 (待移动的下标)
                const oldIndexes = getSubTree(bst, childIndex).map((item) => item.index);
                // 获取这些待移动下标的目的坐标
                const targetIndexes = getSubTree(bst, childIndex).map((item, i) => {
                    // 如果是第一个元素，则直接移动到 targetIndex
                    if (i === 0) return targetIndex
                    // 如果是父结点的左孩子，则移动到 targetIndex * 2 + 1
                    else if (item.dir === 'l') {
                        return targetIndex * 2 + 1
                    }
                    // 如果是父结点右孩子，则移动到 targetIndex * 2 + 2
                    else {
                        return targetIndex * 2 + 2
                    }
                })

                seq.push([{
                    type: ActionTypes.Move,
                    payload: {
                        oldIndexes,
                        targetIndexes
                    }
                }])
                seq.push([{
                    type: ActionTypes.Delete,
                    payload: {
                        oldIndexes,
                        targetIndexes
                    }
                }])
            } else {
                // 否则递归搜索其右子树
                deleteNodeSeq(bst, targetIndex, indexOfRoot * 2 + 2, seq);
            }

        } else if (bst[targetIndex] < bst[indexOfRoot]) {
            // 如果传入的值小于当前子树根结点的值
            // 则看其左子树
            if (getLChildValue(bst, indexOfRoot) === bst[targetIndex]) {
                // 如果左结点等于nodeV则删除
                seq.push([{ type: ActionTypes.Active, payload: indexOfRoot * 2 + 1 }])
                seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 1 }]);
                seq.push([{ type: ActionTypes.Disappear, payload: indexOfRoot * 2 + 1 }]);

                // 获取删除结点的子结点
                const childIndex = getChildrenIndexes(bst, indexOfRoot * 2 + 1)[0] || getChildrenIndexes(bst, indexOfRoot * 2 + 1)[1];
                // 获取以这个子结点为根结点的子树的所有结点下标 (待移动的下标)
                const oldIndexes = getSubTree(bst, childIndex).map((item) => item.index);
                // 获取这些待移动下标的目的坐标
                const targetIndexes = getSubTree(bst, childIndex).map((item, i) => {
                    // 如果是第一个元素，则直接移动到 targetIndex
                    if (i === 0) return targetIndex
                    // 如果是父结点的左孩子，则移动到 targetIndex * 2 + 1
                    else if (item.dir === 'l') {
                        return targetIndex * 2 + 1
                    }
                    // 如果是父结点右孩子，则移动到 targetIndex * 2 + 2
                    else {
                        return targetIndex * 2 + 2
                    }
                })

                seq.push([{
                    type: ActionTypes.Move,
                    payload: {
                        oldIndexes,
                        targetIndexes
                    }
                }])
                seq.push([{ type: ActionTypes.Delete, payload: oldIndexes }])
            } else {
                // 否则递归搜索其左子树
                deleteNodeSeq(bst, targetIndex, indexOfRoot * 2 + 1, seq);
            }
        } else {
            // 如果当前结点等于nodeV则删除
            seq.push([{ type: ActionTypes.Active, payload: indexOfRoot }])
            seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot }]);
            seq.push([{ type: ActionTypes.Disappear, payload: indexOfRoot }]);

            // 获取删除结点的子结点
            const childIndex = getChildrenIndexes(bst, indexOfRoot)[0] || getChildrenIndexes(bst, indexOfRoot)[1];
            // 获取以这个子结点为根结点的子树的所有结点下标 (待移动的下标)
            const oldIndexes = getSubTree(bst, childIndex).map((item) => item.index);
            // 获取这些待移动下标的目的坐标
            const targetIndexes = getSubTree(bst, childIndex).map((item, i) => {
                // 如果是第一个元素，则直接移动到 targetIndex
                if (i === 0) return targetIndex
                // 如果是父结点的左孩子，则移动到 targetIndex * 2 + 1
                else if (item.dir === 'l') {
                    return targetIndex * 2 + 1
                }
                // 如果是父结点右孩子，则移动到 targetIndex * 2 + 2
                else {
                    return targetIndex * 2 + 2
                }
            })

            seq.push([{
                type: ActionTypes.Move,
                payload: {
                    oldIndexes,
                    targetIndexes
                }
            }])
            seq.push([{ type: ActionTypes.Delete, payload: oldIndexes }])
        }
    }
}

/** 获取查找细节 */
export function searchSeq(bst: any[], nodeV: number, indexOfRoot: number, seq: any[]) {
    // 传入的 bst 必须有一个根结点
    if (bst.length === 0) throw new Error('the length of bst is 0');

    // 如果结点不存在则直接返回
    if (!bst[indexOfRoot]) return;

    seq.push([{ type: ActionTypes.Active, payload: indexOfRoot }])
    seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot }])

    // 判断传入结点的值和当前子树根结点的值的关系
    if (nodeV > bst[indexOfRoot]) {
        // 如果传入的值大于当前子树根结点的值
        // 则看其右子树
        if (getRChildValue(bst, indexOfRoot) === nodeV) {
            // 如果右结点等于nodeV则锁定
            seq.push([{ type: ActionTypes.Active, payload: indexOfRoot * 2 + 2 }])
            seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 2 }])
            seq.push([{ type: ActionTypes.Lock, payload: indexOfRoot * 2 + 2 }])
        } else {
            // 否则递归搜索其右子树
            searchSeq(bst, nodeV, indexOfRoot * 2 + 2, seq);
        }

    } else if (nodeV < bst[indexOfRoot]) {
        // 如果传入的值小于当前子树根结点的值
        // 则看其左子树
        if (getLChildValue(bst, indexOfRoot) === nodeV) {
            // 如果左结点等于nodeV则锁定
            seq.push([{ type: ActionTypes.Active, payload: indexOfRoot * 2 + 1 }])
            seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 1 }])
            seq.push([{ type: ActionTypes.Lock, payload: indexOfRoot * 2 + 1 }])
        } else {
            // 否则递归搜索其右子树
            searchSeq(bst, nodeV, indexOfRoot * 2 + 1, seq);
        }
    } else {
        // 如果当前结点等于nodeV则锁定
        seq.push([{ type: ActionTypes.Active, payload: indexOfRoot }])
        seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot }])
        seq.push([{ type: ActionTypes.Lock, payload: indexOfRoot }])
    }
}


