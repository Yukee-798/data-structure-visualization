import { randomNum } from './index';
import { ActionTypes, Range } from '../types';
import { log } from './math';
import { ISphere3dProps } from '../components/Sphere3d/sphere3d';


/** input输入的value解析为数组，如果输入的不合法则返回 undefined */
export function parseValue(value: string) {
    // 去掉前后括，然后按照逗号划分，再转换成数字数组
    let parseRes = value.substring(1, value.length - 1).split(/[,，]/g).map(item => +item);

    return parseRes.map((value) => isNaN(value) ? null : value);
}

/** 返回初始化二叉树的细节 */
export function initSeq(values: (number | null)[]) {
    const seq = [];
    seq.push([{ type: ActionTypes.Disappear }])
    seq.push([
        { type: ActionTypes.Generate, payload: values },
        { type: ActionTypes.Appear }])
    return seq;
}

/** 传入结点下标，返回二叉树中以该结点为根结点的子树 */
export function getSubTree(binaryTree: (number | null)[], indexOfNode: number) {
    const queue: any[] = [];
    const subTree: any[] = [];

    if (binaryTree.length !== 0) {
        queue.push({ value: binaryTree[indexOfNode], index: indexOfNode });   //根节点进队列
    }
    //队列不为空判断
    while (queue.length !== 0) {

        const lChildV = getLChildValue(binaryTree, queue[0].index);
        const rChildV = getRChildValue(binaryTree, queue[0].index);

        //如果有左孩子，leftChild入队列
        if (lChildV || lChildV === 0) {
            queue.push({ value: lChildV, index: queue[0].index * 2 + 1 })
        }

        //如果有右孩子，rightChild入队列
        if (rChildV || rChildV === 0) {
            queue.push({ value: rChildV, index: queue[0].index * 2 + 2 })
        }
        //已经遍历过的节点出队列
        subTree.push(queue.shift())
    }
    return subTree;
}

/** 格式化二叉树：将spheres中的空元素设置为value为空的sphere */
export function formatSpheres<T extends ISphere3dProps>(spheres: T[]) {
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
export function initSpheres(values: (number | null)[]) {
    return values.map((value, index) => ({ sortIndex: index, sortIndexes: [index], value }))
}

/** 获取传入结点的父结点数据值 */
export function getFatherValue(binaryTree: (number | null)[], indexOfNode: number) {
    return binaryTree[Math.floor((indexOfNode - 1) / 2)];
}

/** 获取传入结点的父结点的下标 */
export function getFatherIndex(indexOfNode: number) {
    return Math.floor((indexOfNode - 1) / 2);
}

/** 获取传入结点子结点下标 */
export function getChildrenIndexes(binaryTree: (number | null)[], indexOfNode: number) {
    let indexes: any[] = [undefined, undefined];
    if (getLChildValue(binaryTree, indexOfNode)) indexes[0] = indexOfNode * 2 + 1;
    if (getRChildValue(binaryTree, indexOfNode)) indexes[1] = indexOfNode * 2 + 2;
    return indexes;
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

/** 获取二叉树层数 */
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


/** 判断二叉树的某个结点有几个子结点 */
export function judgeNode(binaryTree: (number | null)[], indexOfNode: number) {
    let childNum = 0;
    if (getLChildValue(binaryTree, indexOfNode)) childNum++;
    if (getRChildValue(binaryTree, indexOfNode)) childNum++;
    return childNum;
}

/** 获取二叉树前序遍历的细节 */
export function preOrderSeq(binaryTree: (number | null)[], indexOfNode: number, seq: any[]) {
    seq.push([{ type: ActionTypes.Active, payload: indexOfNode }]);
    // seq.push({ type: ActionTypes.ActiveLeft, payload: indexOfNode })
    seq.push([{ type: ActionTypes.Deactive, payload: indexOfNode }]);
    seq.push([{ type: ActionTypes.Lock, payload: indexOfNode }]);
    if (getLChildValue(binaryTree, indexOfNode)) preOrderSeq(binaryTree, indexOfNode * 2 + 1, seq);
    if (getRChildValue(binaryTree, indexOfNode)) preOrderSeq(binaryTree, indexOfNode * 2 + 2, seq);
}

/** 获取二叉树中序遍历的细节 */
export function inOrderSeq(binaryTree: (number | null)[], indexOfNode: number, seq: any[]) {
    if (getLChildValue(binaryTree, indexOfNode)) inOrderSeq(binaryTree, indexOfNode * 2 + 1, seq);
    seq.push([{ type: ActionTypes.Active, payload: indexOfNode }]);
    // seq.push({ type: ActionTypes.ActiveRight, payload: indexOfNode })
    seq.push([{ type: ActionTypes.Deactive, payload: indexOfNode }]);
    seq.push([{ type: ActionTypes.Lock, payload: indexOfNode }])
    if (getRChildValue(binaryTree, indexOfNode)) inOrderSeq(binaryTree, indexOfNode * 2 + 2, seq);
}

/** 获取二叉树后序遍历的细节 */
export function postOrderSeq(binaryTree: (number | null)[], indexOfNode: number, seq: any[]) {
    if (getLChildValue(binaryTree, indexOfNode)) postOrderSeq(binaryTree, indexOfNode * 2 + 1, seq);
    if (getRChildValue(binaryTree, indexOfNode)) postOrderSeq(binaryTree, indexOfNode * 2 + 2, seq);
    seq.push([{ type: ActionTypes.Active, payload: indexOfNode }]);
    // seq.push([{ type: ActionTypes.ActiveLeft, payload: indexOfNode }])
    seq.push([{ type: ActionTypes.Deactive, payload: indexOfNode }]);
    seq.push([{ type: ActionTypes.Lock, payload: indexOfNode }])
}


