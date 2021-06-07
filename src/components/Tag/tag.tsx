import { Tag as AntdTag } from 'antd'
import { IBaseProps } from '../../types';
import './tag.scss'

export type TagType = '删除' | '添加' | '大顶堆' | '数组' | 'avl树' | 'B+树' | 'B树' | '二叉搜索树' | '图论' | '哈希表' | '二叉堆' | '链表' | '队列' | '红黑树' | '栈' | '排序' | '冒泡' | '快排' | '插入' | '选择' | '归并' | '遍历' | '压栈' | '弹栈' | '入队' | '出队' | '搜索' | '二分'
export const MainTags: TagType[] = ['数组', '哈希表', '图论', '栈', '红黑树', '队列', '链表', '二叉堆', 'avl树', '二叉搜索树', 'B+树', 'B树']

interface ITagsProps extends IBaseProps {
    /** 标签组类型 */
    type: TagType
    /** 颜色 */
    // color?: 'geekblue' | 'orange'
    /** 主tag */
    main?: boolean;
}

const Tag: React.FC<ITagsProps> = (props) => {
    const { type, main } = props;
    return (
        <AntdTag color={main ? 'orange' : 'geekblue'}>
            {type}
        </AntdTag>
    )
}

export default Tag;