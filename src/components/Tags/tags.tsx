import { Tag } from 'antd'
import { DataStrucTypes, IBaseProps } from '../../types';
import './tags.scss'



interface ITagsProps extends IBaseProps {
    /** 标签组类型 */
    type: DataStrucTypes
}

const Tags: React.FC<ITagsProps> = (props) => {
    const { type } = props;

    switch (type) {
        case DataStrucTypes.Array:
            return (<div className='tags-warp'>
                <Tag color="geekblue">数组</Tag>
            </div>);

        case DataStrucTypes.AVLTree:
            return (<div className='tags-warp'>
                <Tag color="geekblue">avl树</Tag>
            </div>);

        case DataStrucTypes.BPlusTree:
            return (<div className='tags-warp'>
                <Tag color="geekblue">B+树</Tag>
            </div>);

        case DataStrucTypes.BTree:
            return (<div className='tags-warp'>
                <Tag color="geekblue">B树</Tag>
            </div>);

        case DataStrucTypes.BinarySearchTree:
            return (<div className='tags-warp'>
                <Tag color="geekblue">二叉搜索树</Tag>
            </div>);

        case DataStrucTypes.Graph:
            return (<div className='tags-warp'>
                <Tag color="geekblue">图论</Tag>
            </div>);

        case DataStrucTypes.HashTable:
            return (<div className='tags-warp'>
                <Tag color="geekblue">哈希表</Tag>
            </div>);

        case DataStrucTypes.BinaryHeap:
            return (<div className='tags-warp'>
                <Tag color="geekblue">二叉堆</Tag>
            </div>);

        case DataStrucTypes.LinkedList:
            return (<div className='tags-warp'>
                <Tag color="geekblue">链表</Tag>
            </div>);

        case DataStrucTypes.Queue:
            return (<div className='tags-warp'>
                <Tag color="geekblue">队列</Tag>
            </div>);

        case DataStrucTypes.RedBlackTree:
            return (<div className='tags-warp'>
                <Tag color="geekblue">红黑树</Tag>
            </div>);

        case DataStrucTypes.Stack:
            return (<div className='tags-warp'>
                <Tag color="geekblue">栈</Tag>
            </div>);
        case DataStrucTypes.Sort:
            return (<div className='tags-warp'>
                <Tag color="geekblue">排序</Tag>
            </div>);
        case DataStrucTypes.Traverse:
            return (<div className='tags-warp'>
                <Tag color="orange">遍历</Tag>
            </div>);
        case DataStrucTypes.Search:
            return (<div className='tags-warp'>
                <Tag color="orange">搜索</Tag>
            </div>);
        case DataStrucTypes.Tree:
            return (<div className='tags-warp'>
                <Tag color="orange">树</Tag>
            </div>);

        case DataStrucTypes.BinarySearch:
            return (<div className='tags-warp'>
                <Tag color="orange">二分</Tag>
            </div>);
        case DataStrucTypes.QuickSort:
            return (<div className='tags-warp'>
                <Tag color="orange">快排</Tag>
            </div>);
        case DataStrucTypes.SelectSort:
            return (<div className='tags-warp'>
                <Tag color="orange">选择</Tag>
            </div>);
        case DataStrucTypes.InsertSort:
            return (<div className='tags-warp'>
                <Tag color="orange">插入</Tag>
            </div>);
        case DataStrucTypes.BubbleSort:
            return (<div className='tags-warp'>
                <Tag color="orange">冒泡</Tag>
            </div>);
        case DataStrucTypes.MergeSort:
            return (<div className='tags-warp'>
                <Tag color="orange">归并</Tag>
            </div>);
        case DataStrucTypes.Push:
            return (<div className='tags-warp'>
                <Tag color="orange">压栈</Tag>
            </div>);
        case DataStrucTypes.Pop:
            return (<div className='tags-warp'>
                <Tag color="orange">弹栈</Tag>
            </div>);
        case DataStrucTypes.Enqueue:
            return (<div className='tags-warp'>
                <Tag color="orange">入队</Tag>
            </div>);
        case DataStrucTypes.Dequeue:
            return (<div className='tags-warp'>
                <Tag color="orange">出队</Tag>
            </div>);
        default:
            return (
                <></>
            )
    }
}

export default Tags;