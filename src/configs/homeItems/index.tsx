import { IHomeItemProps } from "../../components/HomeItem/homeItem";
import { DataStrucTypes } from "../../types";
import Pic from '../../assets/homeItemCovers/84993086_p0.jpg'
import Tags from "../../components/Tags/tags";

/** home 的 item 数据配置 */
export  const homeItemsConfig: Omit<IHomeItemProps, 'onClick'>[][] = [
    // 第一排
    [
        {
            src: Pic,
            tag: (
                <>
                    <Tags type={DataStrucTypes.Array} />
                    <Tags type={DataStrucTypes.BubbleSort} />
                    <Tags type={DataStrucTypes.SelectSort} />
                    <Tags type={DataStrucTypes.InsertSort} />
                    <Tags type={DataStrucTypes.QuickSort} />
                </>
            ),
            title: '排序',
            type: DataStrucTypes.Sort
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.LinkedList} />,
            title: '链表',
            type: DataStrucTypes.LinkedList
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.Stack} />,
            title: '栈',
            type: DataStrucTypes.Stack
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.Queue} />,
            title: '队列',
            type: DataStrucTypes.Queue
        },
    ],
    // 第二排
    [
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.HashTable} />,
            title: '哈希表',
            type: DataStrucTypes.HashTable
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.BinarySearchTree} />,
            title: '二分查找',
            type: DataStrucTypes.BinarySearchTree
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.BinarySearchTree} />,
            title: '二叉搜索树',
            type: DataStrucTypes.BinarySearchTree
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.BinaryHeap} />,
            title: '二叉堆',
            type: DataStrucTypes.BinaryHeap
        },
    ],
    // 第三排
    [
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.AVLTree} />,
            title: 'AVL树',
            type: DataStrucTypes.AVLTree
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.RedBlackTree} />,
            title: '红黑树',
            type: DataStrucTypes.RedBlackTree
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.BTree} />,
            title: 'B树',
            type: DataStrucTypes.BTree
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.BPlusTree} />,
            title: 'B+树',
            type: DataStrucTypes.BPlusTree
        },

    ],
    // 第四排
    [
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.Graph} />,
            title: '图结构',
            type: DataStrucTypes.Graph
        },
        {
            src: Pic,
            tag: <Tags type={DataStrucTypes.Graph} />,
            title: '图遍历',
            type: DataStrucTypes.Graph
        },
    ],
];