import { Tag } from 'antd'
import { DataStrucTypes, IBaseProps } from '../../types';
import './tags.scss'



interface ITagsProps extends IBaseProps {
    /* 标签组类型 */
    type: DataStrucTypes
}

const Tags: React.FC<ITagsProps> = (props) => {
    const { type } = props;

    switch (type) {
        case DataStrucTypes.Array:
            return (<div className='tags-warp'>
                <Tag color="magenta">数组</Tag>
            </div>);

        case DataStrucTypes.AVLTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">avl树</Tag>
            </div>);

        case DataStrucTypes.BPlusTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">B+树</Tag>
            </div>);

        case DataStrucTypes.BTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">B树</Tag>
            </div>);

        case DataStrucTypes.BinarySearchTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">二叉搜索树</Tag>
            </div>);

        case DataStrucTypes.Graph:
            return (<div className='tags-warp'>
                <Tag color="magenta">图</Tag>
            </div>);

        case DataStrucTypes.HashTable:
            return (<div className='tags-warp'>
                <Tag color="magenta">哈希表</Tag>
            </div>);

        case DataStrucTypes.BinaryHeap:
            return (<div className='tags-warp'>
                <Tag color="magenta">二叉堆</Tag>
            </div>);

        case DataStrucTypes.LinkedList:
            return (<div className='tags-warp'>
                <Tag color="magenta">链表</Tag>
            </div>);

        case DataStrucTypes.Queue:
            return (<div className='tags-warp'>
                <Tag color="magenta">队列</Tag>
            </div>);

        case DataStrucTypes.RedBlackTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">红黑树</Tag>
            </div>);

        case DataStrucTypes.Stack:
            return (<div className='tags-warp'>
                <Tag color="magenta">栈</Tag>
            </div>);
        case DataStrucTypes.Sort:
            return (<div className='tags-warp'>
                <Tag color="magenta">排序</Tag>
            </div>);
        case DataStrucTypes.Traverse:
            return (<div className='tags-warp'>
                <Tag color="magenta">遍历</Tag>
            </div>);
        case DataStrucTypes.Search:
            return (<div className='tags-warp'>
                <Tag color="magenta">搜索</Tag>
            </div>);
        case DataStrucTypes.Tree:
            return (<div className='tags-warp'>
                <Tag color="magenta">树</Tag>
            </div>);

        case DataStrucTypes.BinarySearch:
            return (<div className='tags-warp'>
                <Tag color="magenta">二分</Tag>
            </div>);
        case DataStrucTypes.QuickSort:
            return (<div className='tags-warp'>
                <Tag color="magenta">快排</Tag>
            </div>);
        case DataStrucTypes.SelectSort:
            return (<div className='tags-warp'>
                <Tag color="magenta">选择</Tag>
            </div>);
        case DataStrucTypes.InsertSort:
            return (<div className='tags-warp'>
                <Tag color="magenta">插入</Tag>
            </div>);
        case DataStrucTypes.BubbleSort:
            return (<div className='tags-warp'>
                <Tag color="magenta">冒泡</Tag>
            </div>);
        case DataStrucTypes.MergeSort:
            return (<div className='tags-warp'>
                <Tag color="magenta">归并</Tag>
            </div>);
        default:
            return (
                <></>
            )
    }
}

export default Tags;