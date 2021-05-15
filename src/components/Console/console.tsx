import { Button, Drawer } from "antd";
import { DataStrucTypes, IBaseProps } from "../../types";
import './console.scss'

interface IConsole extends IBaseProps {
    /** 是否禁用控制台操作 */
    disabled?: boolean;
    /** 禁用控制台操作时的节点渲染 */
    occupition?: React.ReactNode
}

const Console: React.FC<IConsole> = (props) => {
    const { disabled, occupition, children } = props;

    return (
        <div className='console-warp'>
            {disabled ?
                <div className='mask'>
                    {occupition}
                </div> : <></>}
            {children}
        </div>
    )
}




export default Console;