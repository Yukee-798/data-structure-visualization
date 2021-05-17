import { randomNum } from '.';
import { ISphere } from '../pages/BinarySearchTree/binarySearchTree';
import { log } from './math';

/** 获取传入节点的左孩子数据值 */
export function getLChildValue<T>(binaryTree: T[], indexOfNode: number) {
    return binaryTree[indexOfNode * 2 + 1];
}

/** 获取传入节点的右孩子数据值 */
export function getRChildValue<T>(binaryTree: T[], indexOfNode: number) {
    return binaryTree[indexOfNode * 2 + 2]
}

/** 为传入的节点设置左孩子 */
export function setLChild<T>(binaryTree: T[], indexOfNode: number, lChild: T) {
    const root = binaryTree[indexOfNode];
    if (root) binaryTree[indexOfNode * 2 + 1] = lChild;
    else throw 'node is null';
}

/** 为传入的节点设置右孩子 */
export function setRChild<T>(binaryTree: T[], indexOfNode: number, rChild: T) {
    const root = binaryTree[indexOfNode];
    if (root) binaryTree[indexOfNode * 2 + +2] = rChild;
    else throw 'node is null';
}

/** 根据传入的下标获取结点所在的二叉树层数 */
export function getDeepthByNodeIndex(indexOfNode: number) {
    return Math.floor(log(2, indexOfNode + 1));
}

/** 随机生成结点数为n的二叉树 */
function binaryTreeGenerator(n: number, binaryTree: (number | null)[], indexOfRoot: number) {
    if (n == 0) return;

    // 左孩子的值
    const lChildV = randomNum(1, 80);
    // 右孩子的值
    const rChildV = randomNum(1, 80);

    // 根结点的左子树的结点个数
    const leftN = randomNum(0, n - 1);
    const rightN = n - leftN - 1;

    // 递归建立每棵子树
    setLChild(binaryTree, indexOfRoot, leftN > 0 ? lChildV : null);
    binaryTreeGenerator(leftN, binaryTree, indexOfRoot * 2 + 1)

    setRChild(binaryTree, indexOfRoot, rightN > 0 ? rChildV : null);
    binaryTreeGenerator(rightN, binaryTree, indexOfRoot * 2 + 2)
}

/** 生成层数小于3且结点数在 5 ～ 15 的二叉树 */
export function randomBinaryTree(): (number | null)[] {

    let cache = new Array(500);

    // 如果生成的二叉树的层数大于了3则重新生成
    while (getDeepthByNodeIndex(cache.length - 1) > 3) {
        cache.fill(null);
        cache[0] = randomNum(1, 80);
        binaryTreeGenerator(randomNum(5, 15), cache, 0);

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


export function initSphere(values: (number | null)[]): ISphere[] {
    return values.map((value, index) => ({
        sortIndex: index,
        value,
        isActive: false,
        isLock: false,
    }))
}

