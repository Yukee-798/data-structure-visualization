import { Button, Drawer } from "antd";
import { DataStrucTypes, HomeItemTypes, IBaseProps, OperaTypes } from "../../types";
import './console.scss'

interface IConsole extends IBaseProps {
    /* 控制台类型 */
    type: HomeItemTypes;
    /* 点击控制台按钮时的回调 */
    onOpera: (operaType: OperaTypes) => void;
    /* 是否禁用控制台操作 */
    disabled?: boolean;
    /* 禁用控制台操作时的节点渲染 */

}

const Console: React.FC<IConsole> = (props) => {
    const { type, disabled, onOpera } = props;
    switch (type) {
        case 'sort':
            return (
                // <div className='console-warp' >
                // <>
                //     <Button
                //         className='console-trigger'
                //     >
                //         操作台
                //     </Button>
                //     <Drawer
                //         className='console'
                //         title='操作台'
                //         placement='right'
                //         visible={false}
                //         getContainer={false}
                //     >

                //     </Drawer>
                // </>
                // </div>
                disabled ? <>操作进行中...</> : <>
                    <Button onClick={() => { onOpera(OperaTypes.Random) }}>随机生成</Button>
                    <Button>添加</Button>
                    <Button>删除</Button>
                    <Button onClick={() => { onOpera(OperaTypes.BubbleSort) }}>冒泡排序</Button>
                    <Button onClick={() => { onOpera(OperaTypes.SelectSort) }}>选择排序</Button>
                    <Button onClick={() => { onOpera(OperaTypes.Recover) }}>恢复</Button>
                </>
            )

        case 'linkedList':
            return (
                <div></div>
            )
        case 'stack':
            return (
                <div></div>
            )
        case 'queue':
            return (
                <div></div>
            )



        case 'avlTree':
            return (
                <div></div>
            )
        case 'bPlusTree':
            return (
                <div></div>
            )
        case 'bTree':
            return (
                <div></div>
            )
        case 'binaryHeap':
            return (
                <div></div>
            )
        case 'binarySearch':
            return (
                <div></div>
            )
        case 'binarySearchTree':
            return (
                <div></div>
            )
        case 'graph':
            return (
                <div></div>
            )
        case 'graphTraverse':
            return (
                <div></div>
            )
        case 'hashTable':
            return (
                <div></div>
            )
        case 'redBlackTree':
            return (
                <div></div>
            )

    }
}

export default Console;