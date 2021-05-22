import { useState } from 'react'
import { Col, Row } from 'antd';
import { useHistory } from 'react-router';
import { useSpring, animated, config, useSpringRef, useTransition, useChain } from 'react-spring/web'
import HomeItem from '../../components/HomeItem/homeItem';
import { DataStrucTypes } from '../../types';
import { homeItemsConfig } from '../../configs/homeItems';
import './home.scss'

const Home = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false)

    // const springApi = useSpringRef()
    // const { size, ...rest } = useSpring({
    //     ref: springApi,
    //     config: config.stiff,
    //     from: { size: '20%', opacity: 0 },
    //     to: {
    //         size: open ? '20' : '100%',
    //         opacity: open ? 0 : 1,
    //     },
    // })

    // const transApi = useSpringRef()
    // const transition = useTransition(open ? data : [], {
    //     ref: transApi,
    //     trail: 400 / 12,
    //     from: { opacity: 0, scale: 0 },
    //     enter: { opacity: 1, scale: 1 },
    //     leave: { opacity: 0, scale: 0 },
    // })

    // // This will orchestrate the two animations above, comment the last arg and it creates a sequence
    // useChain(open ? [transApi, springApi] : [springApi, transApi], [
    //     0,
    //     open ? 0.1 : 0.6,
    // ])

    const handleClick = (type: DataStrucTypes) => {
        switch (type) {
            case DataStrucTypes.Sort:
                return history.replace('/sort');
            case DataStrucTypes.LinkedList:
                return history.replace('/linkedList')
            case DataStrucTypes.Stack:
                return history.replace('/stack')
            case DataStrucTypes.Queue:
                return history.replace('/queue')
            case DataStrucTypes.HashTable:
                return history.replace('/hashTable')
            case DataStrucTypes.BinarySearchTree:
                return history.replace('/binarySearchTree')
            case DataStrucTypes.BinaryHeap:
                return history.replace('/binaryHeap')
            case DataStrucTypes.AVLTree:
                return history.replace('/avlTree')
            case DataStrucTypes.RedBlackTree:
                return history.replace('/redBlackTree')
            case DataStrucTypes.BTree:
                return history.replace('/bTree')
            case DataStrucTypes.BPlusTree:
                return history.replace('/bPlusTree')
            case DataStrucTypes.Graph:
                return history.replace('/graph')
        }
    }
    const { size, opacity } = useSpring({
        from: {
            size: '20%',
            opacity: '0',
        },
        to: {
            size: open ? '20%' : '100%',
            opacity: open ? '0' : '1',
        },
        config: config.stiff
    })
    return (
        <div className='home-warp'>
            {homeItemsConfig.map((row, i) => (
                <Row gutter={{ xs: 8, sm: 16, md: 24 }} key={i + '&'}>
                    {row.map((col, j) => (
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} key={i + '&' + j}>
                            <animated.div 
                                className='homeItem-warp'
                                style={{ width: size, height: size, opacity }} 
                                onClick={() => { setOpen(true) }}
                            >
                                <HomeItem
                                    src={col.src}
                                    tag={col.tag}
                                    title={col.title}
                                    type={col.type}
                                    onClick={handleClick}
                                />
                            </animated.div>
                        </Col>
                    ))}
                </Row>
            ))}
        </div >
    )
}

export default Home;