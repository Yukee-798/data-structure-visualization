import { randomArr, randomNum } from '../../utils';
import { ActionTypes, Range } from '../../types';
import { getChildrenIndexes, getDeepthByNodeIndex, getLChildValue, getRChildValue, judgeNode, setLChild, setRChild } from '../../utils/binaryTree';

/** 为二叉搜索树添加结点 */
export function addToBST(bst: any[], indexOfRoot: number, nodeV: number) {
    // 传入的 bst 必须有一个根结点
    if (bst.length === 0) throw new Error('the length of bst is 0');

    if (!bst[indexOfRoot]) return;

    // 判断传入结点的值和当前子树根结点的值的关系
    if (nodeV > bst[indexOfRoot]) {
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

    // 如果生成的二叉搜索树的层数大于了3则重新生成
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

    if (!bst[indexOfRoot]) return;

    seq.push([{ type: ActionTypes.Active, payload: indexOfRoot }])
    seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot }])

    // 判断传入结点的值和当前子树根结点的值的关系
    if (nodeV > bst[indexOfRoot]) {
        // 当前结点的右孩子不存在，则直接挂上去
        if (!getRChildValue(bst, indexOfRoot)) {
            seq.push([{
                type: ActionTypes.Add,
                payload: { value: nodeV, index: indexOfRoot * 2 + 2 }
            }])
        } else {
            addNodeSeq(bst, indexOfRoot * 2 + 2, nodeV, seq);
        }
    } else {
        // 当前结点的左孩子不存在，则直接挂上去
        if (!getLChildValue(bst, indexOfRoot)) {
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
        // 判断传入结点的值和当前子树根结点的值的关系
        if (bst[targetIndex] > bst[indexOfRoot]) {
            // 如果传入的值大于当前子树根结点的值
            // 则看其右子树
            if (getRChildValue(bst, indexOfRoot) === bst[targetIndex]) {
                // 如果右结点等于nodeV则删除
                seq.push([{ type: ActionTypes.Active, payload: indexOfRoot * 2 + 2 }])
                seq.push([{ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 2 }]);
                seq.push([{ type: ActionTypes.Disappear, payload: indexOfRoot * 2 + 2 }]);
                seq.push([{
                    type: ActionTypes.Move,
                    // 需要 move 的结点应该是多个 ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
                    payload: {
                        oldSortIndexes: getChildrenIndexes(bst, indexOfRoot * 2 + 2)[0] || getChildrenIndexes(bst, indexOfRoot * 2 + 2)[1],
                        targetIndexes: indexOfRoot * 2 + 2
                    }
                }])
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


