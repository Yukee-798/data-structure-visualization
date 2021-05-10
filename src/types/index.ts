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

export interface IColorConfig {
    /* 默认颜色 */
    defaultColor: string;
    /* hover颜色 */
    hoverColor: string;
    /* active颜色 */
    activeColor: string;
    /* lock颜色 */
    lockColor: string;
}

export interface ICube {
    value: number;
    strValue: string;
    sortIndex: number;
    isActive: boolean;
    isLock: boolean;
}
