import { IHomeItemProps } from "../../components/HomeItem/homeItem";
import { DataStrucTypes } from "../../types";
import SortPic from '../../assets/homeItemCovers/Sort.jpg';
import StackPic from '../../assets/homeItemCovers/Stack.jpg';
import LinkedListPic from '../../assets/homeItemCovers/LinkedList.jpg';
import QueuePic from '../../assets/homeItemCovers/Queue.jpg';
import BinarySearchTree from '../../assets/homeItemCovers/BinarySearchTree.jpg';

/** home 的 item 数据配置 */
export const homeItemsConfig: Omit<IHomeItemProps, 'onClick'>[][] = [
    // 第一排
    [
        {
            src: SortPic,
            tags: ['数组', '冒泡', '选择', '插入', '快排', '归并'],
            title: '排序',
            type: DataStrucTypes.Sort
        },
        // {
        //     src: LinkedListPic,
        //     tag: <Tags type={DataStrucTypes.LinkedList} />,
        //     title: '链表',
        //     type: DataStrucTypes.LinkedList
        // },
        {
            src: StackPic,
            tags: ['栈', '压栈', '弹栈'],
            title: '栈',
            type: DataStrucTypes.Stack
        },
        {
            src: QueuePic,
            tags: ['队列', '入队', '出队'],
            title: '队列',
            type: DataStrucTypes.Queue
        },
        {
            src: BinarySearchTree,
            tags: ['二叉搜索树', '遍历'],
            title: '二叉搜索树',
            type: DataStrucTypes.BinarySearchTree
        },
    ],
    // 第二排
    // [
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.HashTable} />,
    //         title: '哈希表',
    //         type: DataStrucTypes.HashTable
    //     },
    //     {
    //         src: BinarySearchTree,
    //         tag: (
    //             <Tags type={DataStrucTypes.BinarySearchTree} />
    //         ),
    //         title: '二叉搜索树',
    //         type: DataStrucTypes.BinarySearchTree
    //     },
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.BinaryHeap} />,
    //         title: '二叉堆',
    //         type: DataStrucTypes.BinaryHeap
    //     },
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.AVLTree} />,
    //         title: 'AVL树',
    //         type: DataStrucTypes.AVLTree
    //     },
    // ],
    // // 第三排
    // [
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.RedBlackTree} />,
    //         title: '红黑树',
    //         type: DataStrucTypes.RedBlackTree
    //     },
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.BTree} />,
    //         title: 'B树',
    //         type: DataStrucTypes.BTree
    //     },
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.BPlusTree} />,
    //         title: 'B+树',
    //         type: DataStrucTypes.BPlusTree
    //     },
    //     {
    //         src: Pic,
    //         tag: <Tags type={DataStrucTypes.Graph} />,
    //         title: '图结构',
    //         type: DataStrucTypes.Graph
    //     },

    // ],
];