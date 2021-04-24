import { Col, Layout, Row } from 'antd';
import { useHistory } from 'react-router';
import HomeItem from '../../components/HomeItem/homeItem';
import Tags from '../../components/Tags/tags';
import { DataStrucTypes } from '../../types';
import Pic from '../../assets/homeItemCovers/84993086_p0.jpg'
import './home.scss'
const { Header, Content, Footer } = Layout;

const Home = () => {

    const history = useHistory();



    const handleClick = (type: DataStrucTypes) => {
        switch (type) {
            case DataStrucTypes.Array:
                return history.push('/array')
        }
    }

    return (
        <div className='home-warp'>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Array} />}
                        title='数组'
                        type={DataStrucTypes.Array}
                        onClick={handleClick}

                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.LinkedList} />}
                        title='链表'
                        type={DataStrucTypes.LinkedList}
                        onClick={handleClick}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Queue} />}
                        title='队列'
                        type={DataStrucTypes.Queue}
                        onClick={handleClick}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.HashTable} />}
                        title='哈希表'
                        type={DataStrucTypes.HashTable}
                        onClick={handleClick}
                    />
                </Col>

            </Row>

            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.BinaryTree} />}
                        title='二叉树'
                        type={DataStrucTypes.BinaryTree}
                        onClick={handleClick}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Array} />}
                        title='数组'
                        type={DataStrucTypes.Array}
                        onClick={handleClick}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Array} />}
                        title='数组'
                        type={DataStrucTypes.Array}
                        onClick={handleClick}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Array} />}
                        title='数组'
                        type={DataStrucTypes.Array}
                        onClick={handleClick}
                    />
                </Col>


            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Array} />}
                        title='数组'
                        type={DataStrucTypes.Array}
                        onClick={handleClick}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Array} />}
                        title='数组'
                        type={DataStrucTypes.Array}
                        onClick={handleClick}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Array} />}
                        title='数组'
                        type={DataStrucTypes.Array}
                        onClick={handleClick}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <HomeItem
                        src={Pic}
                        tag={<Tags type={DataStrucTypes.Array} />}
                        title='数组'
                        type={DataStrucTypes.Array}
                        onClick={handleClick}
                    />
                </Col>
            </Row>
        </div >
    )
}


export default Home;