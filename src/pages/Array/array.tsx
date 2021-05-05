import Scene3d from '../../components/Scene3d/scene3d';
import Cuboid3d from '../../components/Cuboid3d/cuboid3d'
import { Button } from 'antd';
import './array.scss'
import { useEffect, useRef, useState } from 'react';
import { bubbleSortSeq, randomArr } from '../../utils/array';
import { Text } from '@react-three/drei';
import { ISortDetail } from '../../types';





const Array = () => {

    const [data, setData] = useState(randomArr());
    const [sortDetails, setSortDetails] = useState<ISortDetail[]>()

    useEffect(() => {
        if (sortDetails) {
            
        }
    }, [sortDetails])
    
    return (
        <div className='array-warp'>
            <Button onClick={() => {
                setData(randomArr());
            }}>Random</Button>
            <Button>Add</Button>
            <Button>Delete</Button>
            <Button onClick={() => {
                // setSortDetails(bubbleSortDetails(data))
            }}>Sort</Button>

            <Scene3d>
                {data.map((value, index) => {
                    let startPos = -(data.length - 1) * 2.5 / 2;
                    return (
                        <>
                            <Cuboid3d
                                key={index}
                                position={[startPos + (index * 2.5), 0, 0]}
                                data={value + ''}
                                // defColor={}
                            />
                            <Text
                                key={-index + 1}
                                color='black'
                                fontSize={0.5}
                                position={[startPos + (index * 2.5), -1, 0]}
                            >
                                {index}
                            </Text>
                        </>
                    )
                })}
            </Scene3d>

        </div>
    )
}

export default Array;