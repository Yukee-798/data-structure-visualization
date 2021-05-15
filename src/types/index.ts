import React from "react";

/** 设置 SortCube 之间的间距 */
export const SORT_CUBE_INTERVAL_DISTANCE = 2;

/** 设置 StackCube 之间的间距 */
export const STACK_CUBE_INTERVAL_DISTANCE = 0.8;

/** 设置 3d 物品在 scene 中的基准 y 轴坐标 */
export const BASE_POSY = -2;

/** 遍历细节数组，分发任务的间隔时间 */
export const DISPATCH_INTERVAL = 320;


export interface IBaseProps {
    style?: React.CSSProperties;
    className?: string;
}

/** 数据结构类型枚举同时也是tag的类型 */
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

/** 3d几何体通用配置 */
export interface IGeometryProps {
    colorConfig?: IColorConfig
    position?: any;
    isActive?: boolean;
    isLock?: boolean;
    isReset?: boolean;
}

export enum ActionTypes {
    Pop,
    PopDone,
    Push,
    PushDone,
    Active,
    Deactive,
    Swap,
    SwapDone,
    Lock,
    UnLock,
    SortDone,
    RandomDone,
    Random,
    Add,
    Delete,
    Search,
}

export interface IColorConfig {
    /** 默认颜色 */
    defaultColor?: string;
    /** hover颜色 */
    hoverColor?: string;
    /** active颜色 */
    activeColor?: string;
    /** lock颜色 */
    lockColor?: string;
}

export interface ICube {
    value: string;
    isActive: boolean;
    isLock: boolean;
}

export type Points = [number, number, number][];
