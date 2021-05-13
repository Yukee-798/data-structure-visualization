import React from "react";

/* 设置 cube 之间的间距 */
export const CUBE_INTERVAL_DISTANCE = 2;
/* 设置 3d 物品在 scene 中的基准 y 轴坐标 */
export const BASE_POSY = -2;
/* 设置遍历节点时的速度 */
export const TRAVERSE_SPEED = 300;


export interface IBaseProps {
    style?: React.CSSProperties;
    className?: string;
}

/* 用于识别控制台类型 */
export type HomeItemTypes = 'avlTree' | 'binaryHeap' | 'binarySearch' | 'binarySearchTree' | 'bPlusTree' | 'bTree' | 'graph' | 'graphTraverse' | 'hashTable' | 'linkedList' | 'queue' | 'redBlackTree' | 'sort' | 'stack';

/* 控制台操作类型 */
export enum OperaTypes {
    // 增删改查
    Add,
    Delete,
    Update,
    Search,
    Random,
    Recover,

    // 排序方面
    BubbleSort,
    SelectSort,
    InsertSort,
    QuickSort,
    MergeSort,

}

/* 数据结构类型枚举同时也是tag的类型 */
export enum DataStrucTypes {
    Sort,
    Array,
    BubbleSort,
    SelectSort,
    InsertSort,
    QuickSort,
    MergeSort,

    LinkedList,
    Queue,
    Stack,

    Search,
    HashTable,
    BinarySearch,

    Tree,
    BinarySearchTree,
    BinaryHeap,
    AVLTree,
    BTree,
    BPlusTree,
    RedBlackTree,

    Graph,
    Traverse,
}



/* 3d几何体通用配置 */
export interface IGeometryProps {
    colorConfig?: IColorConfig
    position?: any;
    isActive?: boolean;
    isLock?: boolean;
    isReset?: boolean;
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

export type Points = [number, number, number][];
