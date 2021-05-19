import { useState } from 'react'
import { Col, Row } from 'antd';
import { useHistory } from 'react-router';
import { useSpring, animated, config } from 'react-spring'
import HomeItem from '../../components/HomeItem/homeItem';
import { DataStrucTypes } from '../../types';
import { homeItemsConfig } from '../../configs/homeItems';
import './home.scss'

const Home = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false)
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
            opacity: '0'
        },
        to: {
            size: open ? '20%' : '100%',
            opacity: open ? '0' : '1'
        },
        config: config.stiff
    })
    return (
        <div className='home-warp'>
            {homeItemsConfig.map((row, i) => (
                <Row gutter={{ xs: 8, sm: 16, md: 24 }} key={i + '&'}>
                    {row.map((col, j) => (
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} key={i + '&' + j}>
                            <animated.div style={{ width: size, height: size, opacity: opacity }} onClick={() => { setOpen(true) }}>
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