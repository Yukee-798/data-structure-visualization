import { Tag as AntdTag } from 'antd'
import { IBaseProps } from '../../types';
import './tag.scss'

export type TagType = '数组' | 'avl树' | 'B+树' | 'B树' | '二叉搜索树' | '图论' | '哈希表' | '二叉堆' | '链表' | '队列' | '红黑树' | '栈' | '排序' | '冒泡' | '快排' | '插入' | '选择' | '归并' | '遍历' | '压栈' | '弹栈' | '入队' | '出队' | '搜索' | '二分'


interface ITagsProps extends IBaseProps {
    /** 标签组类型 */
    type: TagType
    /** 颜色 */
    color?: 'geekblue' | 'orange'
}

const Tag: React.FC<ITagsProps> = (props) => {
    const { type, color } = props;
    return (
        <AntdTag color={color}>
            {type}
        </AntdTag>
    )
}

Tag.defaultProps = {
    color: 'geekblue'
}

export default Tag;