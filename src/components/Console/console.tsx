import React, { useEffect, useRef, useState } from "react";
import { Menu, InputNumber, Button, Drawer, Slider, Radio, Divider, Spin, Input } from "antd";
import { LoadingOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { randomNum, useHover } from "../../utils";
import { IBaseProps, Range } from "../../types";
import { animated, config, useSpring } from "@react-spring/web";
import './console.scss'

const { Item, SubMenu } = Menu;

interface radioConfig {
    /** 是否具有序号输入框 */
    hasIndex?: boolean;
    /** 是否具有数值输入框 */
    hasValue?: boolean;
    /** index取值范围 */
    indexRange?: Range;
    /** value取值范围 */
    valueRange?: Range;
    /** radioName 同时对应 buttonName */
    radioName?: string;
}

interface IConsoleProps extends IBaseProps {
    /** 分别表示是否添加、删除、查找 */
    radioGroup: [0 | 1, 0 | 1, 0 | 1];
    /** 控制台左边的操作界面 */
    operation: React.ReactNode;
    /** 控制台右边的显示器 */
    displayer: React.ReactNode;
    /** drawer的高度 */
    drawerHeight?: number;
    /** 是否有silider */
    showSilider?: boolean;
    /** 添加元素输入框配置 */
    addConfig?: radioConfig;
    /** 删除元素输入框配置 */
    deleteConfig?: radioConfig;
    /** 查找元素输入框配置 */
    searchConfig?: radioConfig;
    /** 操作是否正在执行 */
    spinning?: boolean;
    /** slider变化时的回调 */
    onSliderChange?: (value: number) => void;
    /** 点击添加时的回调 */
    onAdd?: (value: number, index: number) => void;
    /** 点击删除时的回调 */
    onDelete?: (value: number, index: number) => void;
    /** 点击搜索时的回调 */
    onSearch?: (value: number, index: number) => void;
    /** 渲染器输入框变化时的回调 */
    onRenderChange?: (value: string) => void;
    /** 点击渲染按钮时的回调 */
    onRender?: (value: string) => void;
}

const Console: React.FC<IConsoleProps> = (props) => {

    const {
        children,
        style,
        operation,
        displayer,
        drawerHeight,
        showSilider,
        radioGroup,
        addConfig,
        deleteConfig,
        searchConfig,
        spinning,
        onSliderChange,
        onAdd,
        onDelete,
        onSearch,
        onRenderChange,
        onRender,
    } = props;

    const [hoverLeftRef, isLeftHover] = useHover();
    const [hoverRenderRef, isRenderHover] = useHover();

    const [isUnfold, setIsUnfold] = useState(false);

    const [addValue, setAddValue] = useState(randomNum(addConfig?.valueRange || [3, 37]));
    const [addIndex, setAddIndex] = useState(randomNum(addConfig?.indexRange || [0, 3]));

    const [deleteValue, setDeleteValue] = useState(randomNum(deleteConfig?.valueRange || [3, 37]));
    const [deleteIndex, setDeleteIndex] = useState(randomNum(deleteConfig?.indexRange || [0, 3]));

    const [searchValue, setSearchValue] = useState(randomNum(searchConfig?.valueRange || [3, 37]));
    const [searchIndex, setSearchIndex] = useState(randomNum(searchConfig?.indexRange || [0, 3]));

    const [renderValue, setRenderValue] = useState('');

    // 被激活的 radio
    const [radioActived, setRadioActived] = useState(0);

    const displayConRef = useRef<HTMLDivElement>();
    const { leftOpacity, renderOpacity } = useSpring({
        leftOpacity: isLeftHover ? 0.7 : 0.2,
        renderOpacity: isRenderHover ? 0.7 : 0.2,
        config: config.gentle
    })

    /** 当 displayer 里面的内容变多的时候，始终保持其滚动条位于底部 */
    useEffect(() => {
        if (displayConRef.current) displayConRef.current.scrollTop = displayConRef.current.scrollHeight;
    }, [displayConRef.current?.scrollHeight])

    const getDefaultRadio = (radioGroup: any[]) => {
        for (let i = 0; i <= radioGroup.length - 1; i++) {
            if (radioGroup[i] === 1) {
                return i;
            }
        }
    }

    /** 统计radioGroup中取值为1的个数是否为1 */
    const isRadioOneNum = (radioGroup: any[]) => {
        let num = 0;
        if (radioGroup[0] === 1) num++;
        if (radioGroup[1] === 1) num++;
        if (radioGroup[2] === 1) num++

        if (num === 1) return true;
        return false;
    }

    return (
        <>
            <animated.div
                className='console-left'
                ref={hoverLeftRef as any}
                style={{ ...style, opacity: leftOpacity }}
            >
                {/* 左侧栏 */}
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

                {/* 抽屉 */}
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
                                    defaultValue={80}
                                    min={40}
                                    onChange={(value: number) => onSliderChange?.(value)}
                                />
                            </div>
                        }


                        <Spin
                            tip='操作执行中...'
                            spinning={spinning}
                            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                        >
                            <div className='operation-main'>
                                {/* 显示操作按钮 */}
                                {operation}

                                {/* 显示添加、删除 */}
                                <div className='input-group'>
                                    {
                                        !(isRadioOneNum(radioGroup)) ?
                                        <Radio.Group
                                            className='radio-group'
                                            defaultValue={getDefaultRadio(radioGroup)}
                                            onChange={(e) => setRadioActived(e.target.value)}
                                        >

                                            {
                                                radioGroup.map((value, i) => {
                                                    if (value === 1 && i === 0) return <Radio key={i} value={i}>{addConfig?.radioName}</Radio>
                                                    else if (value === 1 && i === 1) return <Radio key={i} value={i}>{deleteConfig?.radioName}</Radio>
                                                    else if (value === 1 && i === 2) return <Radio key={i} value={i}>{searchConfig?.radioName}</Radio>
                                                    else return <></>
                                                })
                                            }
                                        </Radio.Group>
                                        : <div className='radio-empty'></div>
                                    }

                                    <div className='label-group'>
                                        {
                                            radioActived === 0 ?
                                                <>
                                                    {
                                                        addConfig?.hasIndex &&
                                                        (<label>
                                                            <span className='label-name'>序号:</span>
                                                            <InputNumber
                                                                min={(addConfig?.indexRange as unknown as number[])[0]}
                                                                max={(addConfig?.indexRange as unknown as number[])[1]}
                                                                value={addIndex}
                                                                onChange={(index) => {
                                                                    setAddIndex(index)
                                                                }}
                                                            />
                                                        </label>)
                                                    }
                                                    {
                                                        addConfig?.hasValue &&
                                                        (<label>
                                                            <span className='label-name'>数值:</span>
                                                            <InputNumber
                                                                min={(addConfig?.valueRange as unknown as number[])[0]}
                                                                max={(addConfig?.valueRange as unknown as number[])[1]}
                                                                value={addValue}
                                                                onChange={(value) => {
                                                                    setAddValue(value)
                                                                }}
                                                            />
                                                        </label>)
                                                    }
                                                    <Button type='primary' onClick={() => onAdd?.(addIndex, addValue)}>{addConfig?.radioName}</Button>
                                                </> :
                                                radioActived === 1 ?
                                                    <>
                                                        {
                                                            deleteConfig?.hasIndex &&
                                                            (<label>
                                                                <span className='label-name'>序号:</span>
                                                                <InputNumber
                                                                    min={(deleteConfig?.indexRange as unknown as number[])[0]}
                                                                    max={(deleteConfig?.indexRange as unknown as number[])[1]}
                                                                    value={deleteIndex}
                                                                    onChange={(index) => {
                                                                        setDeleteIndex(index);
                                                                    }}
                                                                />
                                                            </label>)
                                                        }
                                                        {
                                                            deleteConfig?.hasValue &&
                                                            (<label>
                                                                <span className='label-name'>数值:</span>
                                                                <InputNumber
                                                                    min={(deleteConfig?.valueRange as unknown as number[])[0]}
                                                                    max={(deleteConfig?.valueRange as unknown as number[])[1]}
                                                                    value={deleteValue}
                                                                    onChange={(value) => {
                                                                        setDeleteValue(value)
                                                                    }}
                                                                />
                                                            </label>)
                                                        }
                                                        <Button type='primary' onClick={() => onDelete?.(deleteIndex, deleteValue)}>{deleteConfig?.radioName}</Button>
                                                    </> :
                                                    <>
                                                        {
                                                            searchConfig?.hasIndex &&
                                                            (<label>
                                                                <span className='label-name'>序号:</span>
                                                                <InputNumber
                                                                    min={(searchConfig?.indexRange as unknown as number[])[0]}
                                                                    max={(searchConfig?.indexRange as unknown as number[])[1]}
                                                                    value={searchIndex}
                                                                    onChange={(index) => {
                                                                        setSearchIndex(index);
                                                                    }}
                                                                />
                                                            </label>)
                                                        }
                                                        {
                                                            searchConfig?.hasValue &&
                                                            (<label>
                                                                <span className='label-name'>数值:</span>
                                                                <InputNumber
                                                                    min={(searchConfig.valueRange as unknown as number[])?.[0]}
                                                                    max={(searchConfig.valueRange as unknown as number[])?.[1]}
                                                                    value={searchValue}
                                                                    onChange={(value) => {
                                                                        setSearchValue(value);
                                                                    }}
                                                                />
                                                            </label>)
                                                        }
                                                        <Button type='primary' onClick={() => onSearch?.(searchIndex, searchValue)}>{searchConfig?.radioName}</Button>
                                                    </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Spin>

                    </div>

                    <Divider
                        className='divider'
                        type='vertical'
                    />

                    <div className='displayer'>
                        <div className='content' ref={displayConRef as any}>
                            {displayer}
                        </div>
                    </div>
                </Drawer>
            </animated.div>
            <animated.div
                className='console-render'
                ref={hoverRenderRef as any}
                style={{ ...style, opacity: renderOpacity }}
            >
                <Input
                    bordered={false}
                    onChange={(e) => {
                        setRenderValue(e.target.value.trim());
                        onRenderChange?.(e.target.value.trim());
                    }}
                />
                <Button type='primary' onClick={() => { onRender?.(renderValue) }}>渲染</Button>
            </animated.div>
        </>
    )
}

Console.defaultProps = {
    showSilider: true,
    radioGroup: [1, 1, 1],
    addConfig: {
        hasIndex: true,
        hasValue: true,
        indexRange: [0, 10],
        valueRange: [3, 37],
        radioName: '添加'
    },
    deleteConfig: {
        hasIndex: true,
        hasValue: true,
        indexRange: [0, 10],
        valueRange: [3, 37],
        radioName: '删除'
    },
    searchConfig: {
        hasIndex: true,
        hasValue: true,
        indexRange: [0, 10],
        valueRange: [3, 37],
        radioName: '查找'
    },
    spinning: false
}

export { Item, SubMenu };
export default Console;




