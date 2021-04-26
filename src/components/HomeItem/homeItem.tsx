import { Card } from 'antd'
import { DataStrucTypes, IBaseProps } from '../../types'
import Tags from '../Tags/tags'
import './homeItem.scss'


interface IHomeItemProps extends IBaseProps {
    /* 卡片标题 */
    title: string;
    /* 数据结构类型 */
    type: DataStrucTypes;
    /* 图片资源 */
    src: string;
    /* 标签 */
    tag: React.ReactNode;
    /* 点击事件 */
    onClick: (type: DataStrucTypes) => void;
}

const HomeItem: React.FC<IHomeItemProps> = (props) => {
    const { title, src, tag, type, onClick } = props;

    return (
        <div className='homeItem'>
            <Card
                hoverable
                cover={<img src={src} alt='pic' />}
                onClick={() => {
                    onClick(type);
                }}
            >
                <Card.Meta
                    title={title}
                    description={tag}
                />
            </Card>
        </div>
    )
}

export default HomeItem;