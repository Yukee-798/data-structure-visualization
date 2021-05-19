import { useEffect, useState } from "react";
import { Input, Menu, InputNumber, Button, Drawer } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { useHover } from "../../utils";
import { IBaseProps } from "../../types";
import { animated, config, useSpring } from "react-spring/web";
import './console.scss'

const { Item, SubMenu } = Menu;

interface IConsoleProps extends IBaseProps {
    /** 打开控制台时里面的结点 */
    drawer?: React.ReactNode;
}

const Console: React.FC<IConsoleProps> = (props) => {

    const {
        children,
        style,
        drawer
    } = props;

    const [hoverRef, isHover] = useHover();
    const [isUnfold, setIsUnfold] = useState(false);

    const { opacity } = useSpring({
        opacity: isHover ? 0.7 : 0.2,
        config: config.gentle
    })

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
                height={256}
                visible={isUnfold}
                placement='bottom'
                mask={false}
                onClose={() => { setIsUnfold(false) }}
            >
                {drawer}
            </Drawer>
        </animated.div>
    )
}

export { Item, SubMenu };
export default Console;




