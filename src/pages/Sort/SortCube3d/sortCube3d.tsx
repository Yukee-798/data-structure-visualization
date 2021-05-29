import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Cube3d, { ICube3dProps } from '../../../components/Cube3d/cube3d';
import config from '../config'

interface ISortCube3dProps extends ICube3dProps {
    sortIndexes: number[];
    sortIndex: number;
    startPosX: any;
}

const SortCube3d: React.FC<ISortCube3dProps> = (props) => {

    const {
        sortIndexes,
        sortIndex,
        startPosX,
        value,
        ...restProps
    } = props;

    const meshRef = useRef<THREE.Mesh>(null!)

    /** 根据传入的排序下标，获取到 cube 所在的 X 坐标 */
    const getPosX = (sortIndex: number) => startPosX + (sortIndex * config.geoBaseDistance);

    /** 移动元素时，获取其起始位置 */
    const getOrginPosX = () => {
        return getPosX(sortIndex);
    }

    /** 移动元素时，获取其目标位置 */
    const getTargetPosX = () => {
        return getPosX(sortIndexes[sortIndexes.length - 1]);
    }

    const oldPosX = getOrginPosX();
    const targetPosX = getTargetPosX();


    useFrame(() => {

        const delta = Math.abs(oldPosX - targetPosX) / (config.animationSpeed / 20);

        // 如果当前 sortIndex 需要改变
        if (delta) {

            // mesh 需要往右移
            if (oldPosX - targetPosX < 0 && meshRef.current.position.x < targetPosX) {
                meshRef.current.translateX(delta);
                if (meshRef.current.position.x >= targetPosX) {
                    meshRef.current.position.x = targetPosX;
                }
            }

            // mesh 需要往左移
            else if (oldPosX - targetPosX > 0 && meshRef.current.position.x > targetPosX) {
                meshRef.current.translateX(-delta);
                if (meshRef.current.position.x <= targetPosX) {
                    meshRef.current.position.x = targetPosX;
                }
            }
        }
    })

    return (
        <Cube3d
            args={[1, value ? value * 0.2 : 0, 1]}
            value={value}
            ref={meshRef}
            {...restProps}
        />
    )
}

SortCube3d.defaultProps = {
    colorConfig: {
        defaultColor: 'wheat',
        activeColor: 'orange',
        hoverColor: 'skyblue',
        lockColor: '#8076a3'
    }
}

export default React.memo(SortCube3d);