import { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, PageHeader, Steps } from 'antd';
import { Text } from '@react-three/drei';
import Console, { Item, SubMenu } from '../../components/Console/console';
import Scene3d from '../../components/Scene3d/scene3d';
import { ActionTypes, IReducer, OpeDetailTypes } from '../../types';
import { BarChartOutlined, DotChartOutlined } from '@ant-design/icons';
import { initState, IState, reducer } from './store';
import { treeToString } from '../BinarySearchTree/utils';
import config from './config';
import './binaryHeap.scss'

const { Step } = Steps;

const BinaryHeap = () => {

    const history = useHistory();
    const [state, dispatch] = useReducer<IReducer<IState>, IState>(reducer, initState, (state): IState => {
        return {
            ...state,
        }
    })

    /** 场景是否加载完毕 */
    const [isSceneLoaded, setIsSceneLoaded] = useState(false);

    /** 处理场景加载完毕回调 */
    const handleSceneLoaded = () => {
        setIsSceneLoaded(true);
    }

    /** 随机生成数据 */
    const handleRandom = () => {
        dispatch({ type: ActionTypes.Random });
        setTimeout(() => {
            dispatch({ type: ActionTypes.RandomDone })
        }, 400);
    }
    return (
        <div className='binaryHeap-warp'>
            <PageHeader
                onBack={() => {
                    history.goBack();
                    window.location.reload();
                }}
                title='二叉堆'
            />

            <div className='main'>
                <Scene3d
                    onLoaded={handleSceneLoaded}
                    cameraPosZ={config.cameraPosZ}
                >

                </Scene3d>

                <Console
                    style={{ display: isSceneLoaded ? 'flex' : 'none' }}
                    // onSliderChange={handleSliderChange}
                    isAddIndex={false}
                    isSearch={true}
                    // onAdd={handleAddEle}
                    // onDelete={handleDeleteEle}
                    // onSearch={handleSearch}
                    operation={
                        <div className='btn-group'>
                            <div className='row'>
                                <Button icon={<BarChartOutlined />} onClick={handleRandom}>随机生成</Button>
                                {/* <Button icon={<BarChartOutlined />} onClick={handlePreorder}>前序遍历</Button>
                                <Button icon={<BarChartOutlined />} onClick={handleInorder}>中序遍历</Button>
                                <Button icon={<BarChartOutlined />} onClick={handlePostorder}>后序遍历</Button> */}
                            </div>
                        </div>
                    }

                    displayer={
                        <Steps direction="vertical" size="small" current={state.opeDetails.length - 1}>
                            {state.opeDetails.map((item, i) => {
                                const { type, payload } = item;
                                switch (type) {
                                    case OpeDetailTypes.InOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`中序遍历: [${payload}]`}
                                            />
                                        )

                                    case OpeDetailTypes.PreOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`前序遍历: [${payload}]`}
                                            />
                                        )

                                    case OpeDetailTypes.PostOrderDetails:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`后序遍历: [${payload}]`}
                                            />
                                        )

                                    case OpeDetailTypes.Add: {
                                        const { index, value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`新增结点: i=${index}, v=${value}`}
                                                description={`当前二叉树: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    case OpeDetailTypes.Delete: {
                                        const { index, value, cur } = payload;
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`删除结点: i=${index}, v=${value}`}
                                                description={`当前二叉树: ${treeToString(cur)}`}
                                            />
                                        )
                                    }

                                    default:
                                        return (
                                            <Step
                                                key={'step' + i}
                                                title={`当前二叉树: ${payload}`}
                                            />
                                        )
                                }
                            })}
                        </Steps>
                    }
                >
                    <Item
                        key='item1'
                        icon={<DotChartOutlined />}
                        onClick={handleRandom}
                    >
                        随机生成
                    </Item>

                    <SubMenu
                        key='item2'
                        icon={<BarChartOutlined />}
                        title='遍历'
                    >
                        {/* <Item onClick={handlePreorder}>前序遍历</Item>
                        <Item onClick={handleInorder}>中序遍历</Item>
                        <Item onClick={handlePostorder}>后序遍历</Item> */}
                    </SubMenu>
                </Console>
            </div>

        </div>
    )
}

export default BinaryHeap;


