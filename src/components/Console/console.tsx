import { useEffect, useRef, useState } from "react";
import { Menu, InputNumber, Button, Drawer, Slider, Radio } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { useHover } from "../../utils";
import { IBaseProps, Range } from "../../types";
import { animated, config, useSpring } from "react-spring/web";
import './console.scss'

const { Item, SubMenu } = Menu;

interface IConsoleProps extends IBaseProps {
    /** 控制台左边的操作界面 */
    operation?: React.ReactNode;
    /** 控制台右边的显示器 */
    displayer?: React.ReactNode;
    /** drawer的高度 */
    drawerHeight?: number;
    /** 是否有silider */
    showSilider?: boolean;
    /** 是否可以添加、删除元素 */
    isUpdate?: boolean;
    /** 是否可以搜索元素 */
    isSearch?: boolean;
    /** 添加元素时是否显示序号输入框 */
    isAddIndex?: boolean;
    /** 删除元素时是否显示序号输入框 */
    isDeleteIndex?: boolean;
    /** 设置value范围 */
    valueRange?: Range;
    /** 设置index范围 */
    indexRange?: Range;
    /** 设置value默认值 */
    defaultValue?: number;
    /** 设置index默认值 */
    defaultIndex?: number;
    /** 添加按钮的文字 */
    addText?: string;
    /** 删除按钮的文字 */
    deleteText?: string;
    /** slider变化时的回调 */
    onSliderChange?: (value: number) => void;
    /** value改变时的回调 */
    onValueChange?: (value: number) => void;
    /** index改变时的回调 */
    onIndexChange?: (index: number) => void;
    /** 点击添加时的回调 */
    onAdd?: (value: number, index: number) => void;
    /** 点击删除时的回调 */
    onDelete?: (index: number) => void;
    /** 点击搜索时的回调 */
    onSearch?: (value: number) => void;
}

const Console: React.FC<IConsoleProps> = (props) => {

    const {
        children,
        style,
        operation,
        displayer,
        drawerHeight,
        showSilider,
        addText,
        defaultIndex,
        valueRange,
        indexRange,
        defaultValue,
        deleteText,
        isUpdate,
        isAddIndex,
        isDeleteIndex,
        isSearch,
        onSliderChange,
        onAdd,
        onDelete,
        onIndexChange,
        onValueChange,
        onSearch
    } = props;

    const [hoverRef, isHover] = useHover();
    const [isUnfold, setIsUnfold] = useState(false);
    /** 控制台的添加删除元素的value和index */
    const [value, setValue] = useState(defaultValue || 0);
    const [index, setIndex] = useState(defaultIndex || 0);

    // 被激活的 radio
    const [radioActived, setRadioActived] = useState(1);

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
                    {showSilider &&
                        <div className='slider-warp'>
                            动画速度：
                            <Slider
                                className='slider'
                                defaultValue={32}
                                onChange={(value: number) => onSliderChange?.(value)}
                            />
                        </div>
                    }

                    {/* 显示操作按钮 */}
                    {operation}

                    {/* 显示添加、删除 */}
                    {
                        isUpdate &&
                        <div className='input-group'>
                            <Radio.Group
                                className='radio-group'
                                defaultValue={1}
                                onChange={(e) => {
                                    setRadioActived(e.target.value);
                                }}
                            >
                                <Radio value={1}>{addText}</Radio>
                                <Radio value={2}>{deleteText}</Radio>
                                {isSearch && <Radio value={3}>查找</Radio>}
                            </Radio.Group>

                            <div className='label-group'>
                                {
                                    radioActived === 1 ?
                                        (
                                            <>
                                                {
                                                    isAddIndex &&
                                                    (<label>
                                                        <span className='label-name'>序号:</span>
                                                        <InputNumber
                                                            // min={(indexRange as unknown as number[])?.[0]}
                                                            // max={(indexRange as unknown as number[])?.[0]}
                                                            defaultValue={defaultIndex}
                                                            onChange={(index) => {
                                                                setIndex(index as number)
                                                            }}
                                                        />
                                                    </label>)
                                                }
                                                <label>
                                                    <span className='label-name'>数值:</span>
                                                    <InputNumber
                                                        // min={(valueRange as unknown as number[])?.[0]}
                                                        // max={(valueRange as unknown as number[])?.[1]}
                                                        defaultValue={defaultValue}
                                                        onChange={(value) => {
                                                            setValue(value as number)
                                                            onValueChange?.(value);
                                                        }}
                                                    />
                                                </label>
                                            </>
                                        ) : radioActived === 2 ?
                                            (
                                                isDeleteIndex &&
                                                (<label>
                                                    <span className='label-name'>序号:</span>
                                                    <InputNumber
                                                        // min={(indexRange as unknown as number[])?.[0]}
                                                        // max={(indexRange as unknown as number[])?.[0]}
                                                        defaultValue={defaultIndex}
                                                        onChange={(index) => {
                                                            setIndex(index as number)
                                                        }}
                                                    />
                                                </label>)
                                            ) : isSearch && 
                                            (
                                                (<label>
                                                    <span className='label-name'>数值:</span>
                                                    <InputNumber
                                                        // min={(valueRange as unknown as number[])?.[0]}
                                                        // max={(valueRange as unknown as number[])?.[0]}
                                                        defaultValue={defaultIndex}
                                                        onChange={(index) => {
                                                            setIndex(index as number)
                                                        }}
                                                    />
                                                </label>)
                                            )
                                }

                                {radioActived === 1 && <Button type='primary' onClick={() => onAdd?.(value, index)}>{addText}</Button>}
                                {radioActived === 2 && <Button type='primary' onClick={() => onDelete?.(index)}>{deleteText}</Button>}
                                {radioActived === 3 && <Button type='primary' onClick={() => onSearch?.(index)}>查找</Button>}

                            </div>
                        </div>
                    }
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

Console.defaultProps = {
    showSilider: true,
    addText: '添加',
    deleteText: '删除',
    defaultIndex: 2,
    defaultValue: 3,
    valueRange: [3, 90] as Range,
    indexRange: [0, 10] as Range,
    isUpdate: true,
    isSearch: false,
    isAddIndex: true,
    isDeleteIndex: true,
}

export { Item, SubMenu };
export default Console;




