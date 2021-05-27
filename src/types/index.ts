import React from "react";

/** 设置 SortCube 之间的间距 */
export const SORT_CUBE_INTERVAL_DISTANCE = 2;

/** 设置 StackCube 之间的间距 */
export const STACK_CUBE_INTERVAL_DISTANCE = 0.8;

/** 设置 QueueCube 之间的间距 */
export const QUEUE_CUBE_INTERVAL_DISTANCE = 2.2;

/** 设置 LinkCube 之间的间距 */
export const LINK_CUBE_INTERVAL_DISTANCE = 3.5;

/** 设置 3d 物品在 scene 中的基准 y 轴坐标 */
export const BASE_POSY = -2;


/** 520 ~ 120
 


 */

/** 遍历细节数组，分发任务的间隔时间 */
export const DISPATCH_INTERVAL = 320;


export interface IBaseProps {
    style?: React.CSSProperties;
    className?: string;
}

/** 主页的item类型 */
export enum DataStrucTypes {
    Sort,
    LinkedList,
    Queue,
    Stack,
    HashTable,
    BinarySearchTree,
    BinaryHeap,
    AVLTree,
    BTree,
    BPlusTree,
    RedBlackTree,
    Graph
}

/** 3d几何体通用配置 */
export interface IGeometryProps {
    mRef?: any;
    /** 构造参数 */
    args?: any;
    /** 取值 */
    value: number | null;
    /** 是否消失 */
    disappear?: boolean;
    /** 颜色配置 */
    colorConfig?: IColorConfig
    /** 位置 */
    position?: any;
    /** 是否激活 */
    isActive?: boolean;
    /** 是否锁定 */
    isLock?: boolean;
}

/** 控制台操作细节类型 */
export enum OpeDetailTypes {
    Swap = '交换',
    Add = '新增元素',
    Delete = '删除元素',
    HeadInsert = '头部插入',
    TailInsert = '尾部插入',
    Pop = '弹栈',
    Push = '压栈',
    Enqueue = '入队',
    Dequeue = '出队',
    PreOrderDetails = '前序遍历',
    InOrderDetails = '中序遍历',
    PostOrderDetails = '后序遍历',
    Default = '数据源'
}


export type IReducer<T> = (state: T, action: IAction) => T;

export interface IAction {
    type: ActionTypes;
    payload?: any;
}

export enum ActionTypes {
    Pop,
    PopDone,
    Push,
    PushDone,
    Active,
    ActiveLeft,
    ActiveRight,
    Deactive,
    Swap,
    SwapDone,
    Lock,
    UnLock,
    SortDone,
    RandomDone,
    Random,
    Add,
    AddDone,
    Delete,
    DeleteDone,
    Search,
    Move,
    Enqueue,
    Dequeue,
    DequeueDone,
    Disappear,
    HeadInsert,
    TailInsert,
    ShowArrow,
    MoveDown,
    MoveTop,
    StartPreorder,
    StartInOrder,
    StartPostOrder
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


export type Points = [number, number, number][];
