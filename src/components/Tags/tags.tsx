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
                <Tag color="magenta">Array</Tag>
            </div>);

        case DataStrucTypes.AVLTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">AVLTree</Tag>
            </div>);

        case DataStrucTypes.BPlusTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">BPlusTree</Tag>
            </div>);

        case DataStrucTypes.BTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">BTree</Tag>
            </div>);

        case DataStrucTypes.BinarySearchTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">BinarySearchTree</Tag>
            </div>);

        case DataStrucTypes.Graph:
            return (<div className='tags-warp'>
                <Tag color="magenta">Graph</Tag>
            </div>);

        case DataStrucTypes.HashTable:
            return (<div className='tags-warp'>
                <Tag color="magenta">HashTable</Tag>
            </div>);

        case DataStrucTypes.Heap:
            return (<div className='tags-warp'>
                <Tag color="magenta">Heap</Tag>
            </div>);

        case DataStrucTypes.LinkedList:
            return (<div className='tags-warp'>
                <Tag color="magenta">LinkedList</Tag>
            </div>);

        case DataStrucTypes.Queue:
            return (<div className='tags-warp'>
                <Tag color="magenta">Queue</Tag>
            </div>);

        case DataStrucTypes.RedBlackTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">RedBlackTree</Tag>
            </div>);

        case DataStrucTypes.Stack:
            return (<div className='tags-warp'>
                <Tag color="magenta">Stack</Tag>
            </div>);
        case DataStrucTypes.BinaryTree:
            return (<div className='tags-warp'>
                <Tag color="magenta">BinaryTree</Tag>
            </div>);
    }
}

export default Tags;