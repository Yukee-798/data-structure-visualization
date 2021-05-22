import { useEffect, useRef, useState } from "react";
import { Input, Menu, InputNumber, Button, Drawer, Slider, InputNumberProps } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { useHover } from "../../utils";
import { IBaseProps } from "../../types";
import { animated, config, useSpring } from "react-spring/web";
import './console.scss'

const { Item, SubMenu } = Menu;

interface IConsoleProps extends IBaseProps {
    /** 控制台左边的操作界面 */
    operation?: React.ReactNode;
    /** 控制台右边的显示器 */
    displayer?: React.ReactNode;
    /** slider变化时的回调 */
    onSliderChange?: (value: number) => void;
    /** drawer的高度 */
    drawerHeight?: number;
}

const Console: React.FC<IConsoleProps> = (props) => {

    const {
        children,
        style,
        operation,
        displayer,
        drawerHeight,
        onSliderChange
    } = props;

    const [hoverRef, isHover] = useHover();
    const [isUnfold, setIsUnfold] = useState(false);
    const displayConRef = useRef<HTMLDivElement>();

    const { opacity } = useSpring({
        opacity: isHover ? 0.7 : 0.2,
        config: config.gentle
    })

    /** 当 displayer 里面的内容变多的时候，始终保持其滚动条位于底部 */
    useEffect(() => {
        if (displayConRef.current) displayConRef.current.scrollTop = displayConRef.current.scrollHeight;
    }, [displayConRef.current?.scrollHeight])

    return (
        <animated.div
            className='console-warp'
            ref={hoverRef as any}
            style={{ ...style, opacity }}
        >
            <Menu
                className='console'
                mode="inline"
                theme="dark"
                inlineCollapsed={true}
                selectable={false}
                style={{ display: isUnfold ? 'none' : 'inline-block' }}
            >
                <Item
                    icon={<MenuUnfoldOutlined />}
                    key='item0'
                    onClick={() => {
                        setIsUnfold(true);
                    }}
                >
                    展开操作台
                </Item>
                {children}
            </Menu>
            <Drawer
                className='console-drawer'
                title='操作台'
                height={drawerHeight}
                visible={isUnfold}
                placement='bottom'
                mask={false}
                onClose={() => { setIsUnfold(false) }}
            >

                <div className='operation'>
                    <div className='slider-warp'>
                        动画速度：
                        <Slider
                            className='slider'
                            defaultValue={32}
                            onChange={(value: number) => onSliderChange?.(value)}
                        />
                    </div>
                    {operation}
                </div>

                <div className='displayer'>
                    <div className='content' ref={displayConRef as any}>
                        {displayer}
                    </div>
                </div>
            </Drawer>
        </animated.div>
    )
}

export { Item, SubMenu };
export default Console;




