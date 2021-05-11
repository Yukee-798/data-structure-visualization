import React from "react";

/* 设置 cube 之间的间距 */
export const CUBE_INTERVAL_DISTANCE = 2;
/* 设置 3d 物品在 scene 中的基准 y 轴坐标 */
export const BASE_POSY = -2;


export interface IBaseProps {
    style?: React.CSSProperties;
    className?: string;
}


/* 数据结构类型枚举 */
export enum DataStrucTypes {
    Array,
    AVLTree,
    BinarySearchTree,
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
