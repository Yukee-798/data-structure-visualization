import { useEffect } from "react";
import { Input, Menu, InputNumber, Button } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { useHover } from "../../utils";
import { IBaseProps } from "../../types";
import { animated, config, useSpring } from "react-spring/web";
import './console.scss'

const { Item, SubMenu } = Menu;

interface IConsoleProps extends IBaseProps {
    /** 点击了展开按钮的回调 */
    onUnFold?: () => void;
}

// const InputItem: React.FC = (props) => {
//     return (
//         <Item>
//             <Input bordered={false} width={20} />
//             <Button>添加</Button>
//         </Item>
//     )
// }

const Console: React.FC<IConsoleProps> = (props) => {

    const {
        children,
        style,
        onUnFold,
    } = props;

    const [hoverRef, isHover] = useHover();

    const { opacity } = useSpring({
        opacity: isHover ? 0.7 : 0.2,
        config: config.slow
    })

    return (

        <animated.div
            className='console-warp'
            ref={hoverRef as any}
            style={{...style ,opacity}}
        >
            <Menu
                className='console'
                mode="inline"
                theme="dark"
                inlineCollapsed={true}
                selectable={false}
            >
                <Item
                    icon={<MenuUnfoldOutlined />}
                    key={`menuItem0`}
                    onClick={() => onUnFold?.()}
                >
                    展开操作台
                </Item>
                {children}

            </Menu>

        </animated.div>
    )
}

export { Item, SubMenu };
export default Console;



// interface IConsole extends IBaseProps {
//     /** 是否禁用控制台操作 */
//     disabled?: boolean;
//     /** 禁用控制台操作时的结点渲染 */
//     occupition?: React.ReactNode
// }

// const Console: React.FC<IConsole> = (props) => {
//     const { disabled, occupition, children } = props;

//     return (
//         <div className='console-warp'>
//             {disabled ?
//                 <div className='mask'>
//                     {occupition}
//                 </div> : <></>}
//             {children}
//         </div>
//     )
// }




