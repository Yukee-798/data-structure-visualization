import { useSpring, animated, config } from 'react-spring'
import { Card } from 'antd'
import { DataStrucTypes, IBaseProps } from '../../types'
import { useHover } from '../../utils'
import './homeItem.scss'

export interface IHomeItemProps extends IBaseProps {
    /** 卡片标题 */
    title: string;
    /** 数据结构类型 */
    type: DataStrucTypes;
    /** 图片资源 */
    src: string;
    /** 标签 */
    tag: React.ReactNode;
    /** 点击事件 */
    onClick: (type: DataStrucTypes) => void;
}

const HomeItem: React.FC<IHomeItemProps> = (props) => {
    const { title, src, tag, type, onClick } = props;
    const [hoverRef, isHover] = useHover();

    const { scale } = useSpring({
        scale: (
            isHover ? 1.05 : 1
        ),
        config: config.stiff
    });

    return (
        <animated.div
            ref={hoverRef as any}
            className='homeItem'
            style={{ scale }}
        >
            <Card
                hoverable
                cover={<img src={src} alt='pic' />}
                onClick={() => { setTimeout(() => { onClick(type) }, 250) }}
            >
                <Card.Meta
                    title={title}
                    description={tag}
                />
            </Card>
        </animated.div>

    )
}

export default HomeItem;