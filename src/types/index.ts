import React from "react";


export interface IBaseProps {
    style?: React.CSSProperties;
    className?: string;
}


/* 数据结构类型枚举 */
export enum DataStrucTypes {
    Array,
    AVLTree,
    BinarySearchTree,
    BinaryTree,
    BPlusTree,
    BTree,
    Graph,
    HashTable,
    Heap,
    LinkedList,
    Queue,
    RedBlackTree,
    Stack
}

export interface ISortDetail {
    type: 'active' | 'deactive' | 'swap' | 'lock' | 'done';
    indexes?: number[];
}