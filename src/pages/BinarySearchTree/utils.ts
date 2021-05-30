import { randomArr, randomNum } from '../../utils';
import { IBSTSphere3d } from './store';
import { ActionTypes, Range } from '../../types';
import { log } from '../../utils/math';
import { IBSTSphere3dProps } from './BSTSphere3d/bstSphere3d';

/** 格式化二叉树：将spheres中的空元素设置为value为空的sphere */
export function formatSpheres<T extends IBSTSphere3dProps>(spheres: T[]) {
    return spheres.map<T>((sphere, i, arr) => {
        if (!sphere) return { ...arr[0], value: null, sortIndex: i }
        return sphere
    })
}

/** 格式化二叉树：将数组内的空数组全部设置为null */
export function formatBinaryTree(binaryTree: (number | null)[]) {
    for (let i = 0; i < binaryTree.length; i++) {
        if (!binaryTree[i]) {
            binaryTree[i] = null;
        }
    }
    // 将尾部所有的null去掉
    for (let i = binaryTree.length - 1; i >= 0; i--) {
        if (binaryTree[i] !== null) {
            binaryTree.length = i + 1;
            break;
        }
    }
    return [...binaryTree]
}

/** 将传入的二叉树数组转为字符串 */
export function treeToString(binaryTree: (number | null)[]) {
    return '[' + binaryTree.map((value) => !value ? 'null' : value).toString() + ']'
}

/** 初始化二叉树sphere */
export function initSpheres(values: (number | null)[]): IBSTSphere3d[] {
    return values.map((value, index) => ({ sortIndex: index, value }))
}

/** 获取传入结点的父结点数据值 */
export function getFatherValue<T>(binaryTree: T[], indexOfNode: number) {
    return binaryTree[Math.floor((indexOfNode - 1) / 2)];
}

/** 获取传入结点的父结点的下标 */
export function getFatherIndex(indexOfNode: number) {
    return Math.floor((indexOfNode - 1) / 2);
}

/** 获取传入结点的左孩子数据值 */
export function getLChildValue<T>(binaryTree: T[], indexOfNode: number) {
    return binaryTree[indexOfNode * 2 + 1];
}

/** 获取传入结点的右孩子数据值 */
export function getRChildValue<T>(binaryTree: T[], indexOfNode: number) {
    return binaryTree[indexOfNode * 2 + 2]
}

/** 为传入的结点设置左孩子 */
export function setLChild<T>(binaryTree: T[], indexOfNode: number, lChild: T) {
    const root = binaryTree[indexOfNode];
    if (root) binaryTree[indexOfNode * 2 + 1] = lChild;
    else throw new Error('node is null');
}

/** 为传入的结点设置右孩子 */
export function setRChild<T>(binaryTree: T[], indexOfNode: number, rChild: T) {
    const root = binaryTree[indexOfNode];
    if (root) binaryTree[indexOfNode * 2 + 2] = rChild;
    else throw new Error('node is null');
}

/** 根据传入的下标获取结点所在的二叉树层数 */
export function getDeepthByNodeIndex(indexOfNode: number) {
    return Math.floor(log(2, indexOfNode + 1));
}

/** 获取二叉树最大层数 */
export function getMaxDeepth(binaryTree: (number | null)[]) {
    return getDeepthByNodeIndex(binaryTree.length - 1);
}

/** 随机生成结点数为n的二叉树 */
function binaryTreeGenerator(n: number, binaryTree: (number | null)[], nodeValueRange: Range, indexOfRoot: number,) {
    if (n === 0) return;

    // 左孩子的值
    const lChildV = randomNum(nodeValueRange);
    // 右孩子的值
    const rChildV = randomNum(nodeValueRange);

    // 根结点的左子树的结点个数
    const leftN = randomNum([0, n - 1]);
    const rightN = n - leftN - 1;

    // 递归建立每棵子树
    setLChild(binaryTree, indexOfRoot, leftN > 0 ? lChildV : null);
    binaryTreeGenerator(leftN, binaryTree, nodeValueRange, indexOfRoot * 2 + 1)

    setRChild(binaryTree, indexOfRoot, rightN > 0 ? rChildV : null);
    binaryTreeGenerator(rightN, binaryTree, nodeValueRange, indexOfRoot * 2 + 2)
}

/** 生成层数小于3且结点数在 5 ～ 15 的二叉树 */
export function randomBinaryTree(nodeNumsRange: Range, nodeValueRange: Range, maxDeepth: number): (number | null)[] {

    let cache = new Array(500);

    // 如果生成的二叉树的层数大于了3则重新生成
    while (getDeepthByNodeIndex(cache.length - 1) > 3) {
        cache.fill(null);
        cache[0] = randomNum(nodeValueRange);
        binaryTreeGenerator(randomNum(nodeNumsRange), cache, nodeValueRange, 0,);

        // 找到 cache 中最后一个不为 null 的元素的下标
        for (let i = 500; i >= 0; i--) {
            if (cache[i] !== null) {
                cache.length = i + 1;
                break;
            }
        }
    }
    return cache;
}

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

    seq.push({ type: ActionTypes.Active, payload: indexOfRoot })
    seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot })

    // 判断传入结点的值和当前子树根结点的值的关系
    if (nodeV > bst[indexOfRoot]) {
        // 当前结点的右孩子不存在，则直接挂上去
        if (!getRChildValue(bst, indexOfRoot)) {
            seq.push({
                type: ActionTypes.Add,
                payload: { value: nodeV, index: indexOfRoot * 2 + 2 }
            })
        } else {
            addNodeSeq(bst, indexOfRoot * 2 + 2, nodeV, seq);
        }
    } else {
        // 当前结点的左孩子不存在，则直接挂上去
        if (!getLChildValue(bst, indexOfRoot)) {
            seq.push({
                type: ActionTypes.Add,
                payload: { value: nodeV, index: indexOfRoot * 2 + 1 }
            })
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

    // seq.push({ type: ActionTypes.Active, payload: indexOfRoot })
    // seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot })


    // 如果删除的结点是叶子结点
    if (judgeNode(bst, targetIndex) === 0) {


        seq.push({ type: ActionTypes.Active, payload: indexOfRoot })
        seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot })

        // 判断传入结点的值和当前子树根结点的值的关系
        if (bst[targetIndex] > bst[indexOfRoot]) {
            // 如果传入的值大于当前子树根结点的值
            // 则看其右子树
            if (getRChildValue(bst, indexOfRoot) === bst[targetIndex]) {
                // 如果右结点等于nodeV则删除
                seq.push({ type: ActionTypes.Active, payload: indexOfRoot * 2 + 2 })
                seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 2 });
                seq.push({ type: ActionTypes.Disappear, payload: indexOfRoot * 2 + 2 })
                seq.push({ type: ActionTypes.Delete, payload: indexOfRoot * 2 + 2 })
            } else {
                // 否则递归搜索其右子树
                deleteNodeSeq(bst, targetIndex, indexOfRoot * 2 + 2, seq);
            }

        } else if (bst[targetIndex] < bst[indexOfRoot]) {
            // 如果传入的值小于当前子树根结点的值
            // 则看其左子树
            if (getLChildValue(bst, indexOfRoot) === bst[targetIndex]) {
                // 如果左结点等于nodeV则删除
                seq.push({ type: ActionTypes.Active, payload: indexOfRoot * 2 + 1 })
                seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 1 })
                seq.push({ type: ActionTypes.Disappear, payload: indexOfRoot * 2 + 1 })
                seq.push({ type: ActionTypes.Delete, payload: indexOfRoot * 2 + 1 })
            } else {
                // 否则递归搜索其右子树
                deleteNodeSeq(bst, targetIndex, indexOfRoot * 2 + 1, seq);
            }
        } else {
            // 如果当前结点等于nodeV则删除
            seq.push({ type: ActionTypes.Active, payload: indexOfRoot })
            seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot })
            seq.push({ type: ActionTypes.Disappear, payload: indexOfRoot })
            seq.push({ type: ActionTypes.Delete, payload: indexOfRoot })
        }
    }
}



/** 判断二叉树的某个结点有几个子结点 */
export function judgeNode(binaryTree: (number | null)[], indexOfNode: number) {
    let childNum = 0;
    if (getLChildValue(binaryTree, indexOfNode)) childNum++;
    if (getRChildValue(binaryTree, indexOfNode)) childNum++;
    return childNum;
}

/** 获取查找细节 */
export function searchSeq(bst: any[], nodeV: number, indexOfRoot: number, seq: any[]) {
    // 传入的 bst 必须有一个根结点
    if (bst.length === 0) throw new Error('the length of bst is 0');

    // 如果结点不存在则直接返回
    if (!bst[indexOfRoot]) return;

    seq.push({ type: ActionTypes.Active, payload: indexOfRoot })
    seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot })

    // 判断传入结点的值和当前子树根结点的值的关系
    if (nodeV > bst[indexOfRoot]) {
        // 如果传入的值大于当前子树根结点的值
        // 则看其右子树
        if (getRChildValue(bst, indexOfRoot) === nodeV) {
            // 如果右结点等于nodeV则锁定
            seq.push({ type: ActionTypes.Active, payload: indexOfRoot * 2 + 2 })
            seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 2 })
            seq.push({ type: ActionTypes.Lock, payload: indexOfRoot * 2 + 2 })
        } else {
            // 否则递归搜索其右子树
            searchSeq(bst, nodeV, indexOfRoot * 2 + 2, seq);
        }

    } else if (nodeV < bst[indexOfRoot]) {
        // 如果传入的值小于当前子树根结点的值
        // 则看其左子树
        if (getLChildValue(bst, indexOfRoot) === nodeV) {
            // 如果左结点等于nodeV则锁定
            seq.push({ type: ActionTypes.Active, payload: indexOfRoot * 2 + 1 })
            seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot * 2 + 1 })
            seq.push({ type: ActionTypes.Lock, payload: indexOfRoot * 2 + 1 })
        } else {
            // 否则递归搜索其右子树
            searchSeq(bst, nodeV, indexOfRoot * 2 + 1, seq);
        }
    } else {
        // 如果当前结点等于nodeV则锁定
        seq.push({ type: ActionTypes.Active, payload: indexOfRoot })
        seq.push({ type: ActionTypes.Deactive, payload: indexOfRoot })
        seq.push({ type: ActionTypes.Lock, payload: indexOfRoot })
    }
}


/** 获取二叉树前序遍历的细节 */
export function preOrderSeq(binaryTree: (number | null)[], indexOfNode: number, sequence: any[]) {
    sequence.push({ type: ActionTypes.Active, index: indexOfNode });
    // sequence.push({ type: ActionTypes.ActiveLeft, index: indexOfNode })
    sequence.push({ type: ActionTypes.Deactive, index: indexOfNode });
    sequence.push({ type: ActionTypes.Lock, index: indexOfNode });
    if (getLChildValue(binaryTree, indexOfNode)) preOrderSeq(binaryTree, indexOfNode * 2 + 1, sequence);
    if (getRChildValue(binaryTree, indexOfNode)) preOrderSeq(binaryTree, indexOfNode * 2 + 2, sequence);
}

/** 获取二叉树中序遍历的细节 */
export function inOrderSeq(binaryTree: (number | null)[], indexOfNode: number, sequence: any[]) {
    if (getLChildValue(binaryTree, indexOfNode)) inOrderSeq(binaryTree, indexOfNode * 2 + 1, sequence);
    sequence.push({ type: ActionTypes.Active, index: indexOfNode });
    // sequence.push({ type: ActionTypes.ActiveRight, index: indexOfNode })
    sequence.push({ type: ActionTypes.Deactive, index: indexOfNode });
    sequence.push({ type: ActionTypes.Lock, index: indexOfNode })
    if (getRChildValue(binaryTree, indexOfNode)) inOrderSeq(binaryTree, indexOfNode * 2 + 2, sequence);
}

/** 获取二叉树后序遍历的细节 */
export function postOrderSeq(binaryTree: (number | null)[], indexOfNode: number, sequence: any[]) {
    if (getLChildValue(binaryTree, indexOfNode)) postOrderSeq(binaryTree, indexOfNode * 2 + 1, sequence);
    if (getRChildValue(binaryTree, indexOfNode)) postOrderSeq(binaryTree, indexOfNode * 2 + 2, sequence);
    sequence.push({ type: ActionTypes.Active, index: indexOfNode });
    sequence.push({ type: ActionTypes.ActiveLeft, index: indexOfNode })
    sequence.push({ type: ActionTypes.Deactive, index: indexOfNode });
    sequence.push({ type: ActionTypes.Lock, index: indexOfNode })
}


