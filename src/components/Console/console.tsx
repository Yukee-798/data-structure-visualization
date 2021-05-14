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

/* 
            <Button onClick={() => { onOpera(OperaTypes.Random) }}>随机生成</Button>
            <Button>添加</Button>
            <Button>删除</Button>
            <Button onClick={() => { onOpera(OperaTypes.BubbleSort) }}>冒泡排序</Button>
            <Button onClick={() => { onOpera(OperaTypes.SelectSort) }}>选择排序</Button>
            <Button onClick={() => { onOpera(OperaTypes.Recover) }}>恢复</Button>
*/



export default Console;