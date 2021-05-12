import { useState } from 'react'
import { useSpring, animated, useSpringRef, config } from 'react-spring'

import { Card } from 'antd'
import { DataStrucTypes, IBaseProps } from '../../types'
import Tags from '../Tags/tags'
import './homeItem.scss'
import { useHover } from '../../utils'

export interface IHomeItemProps extends IBaseProps {
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

    // const [isClick, setIsClick] = useState(false);
    const [hoverRef, isHover] = useHover();

    const { scale } = useSpring({
        // scale: (
        //     isHover ? 1.02 : 
        //     isClick ? 20 : 1
        // ),
        scale: (
            isHover ? 1.05 : 1
        ),
        config: config.stiff
    });

    // console.log(isHover);

    // const { scale } = useSpring({

    //     // from: { size: '20%', background: 'hotpink' },
    //     // to: {
    //     //     size: isClick ? '100%' : '40%',
    //     //     // background: isClick ? 'white' : 'hotpink',
    //     // },

    //     scale: isHover ? 1.5 : 1,
    //     config: config.wobbly,
    // })


    return (
        <animated.div
            ref={hoverRef as any}
            className='homeItem'
            style={{ scale}}
        >
            <Card

                hoverable
                cover={<img src={src} alt='pic' />}
                onClick={() => {
                    // setIsClick(true);
                    // setTimeout(() => {
                    //     setIsClick(false);
                    // }, 500)
                    // setTimeout(() => {
                        onClick(type);
                    // }, 500)

                }}
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