import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { IGeometryProps } from '../../../types';
import Arrow3d from '../../../components/Arrow3d/arrow3d';
import Cube3d from '../../../components/Cube3d/cube3d';
import config from '../config'


interface ILinkCube3dProps extends IGeometryProps {
    /** 第一个cube的位置 */
    startPosX: any;
    /** 该cube即将经历或者已经历过的所有位置 */
    sortIndexes: number[];
    /** 该cube的当前位置 */
    sortIndex: number;
    /** 从该cube开始，箭头指向的位置 */
    arrowTo: any;
    /** 该元素是否上移 */
    moveTop: boolean;
    /** 该元素是否下移 */
    moveDown: boolean;
}

const LinkCube3d: React.FC<ILinkCube3dProps> = (props) => {

    const {
        position,
        isActive,
        isLock,
        value,
        startPosX,
        colorConfig,
        sortIndex,
        sortIndexes,
        arrowTo,
        moveTop,
        moveDown,
        disappear
    } = props;

    // 箭头的 x, y 坐标
    const [posY, setPosY] = useState(0);
    const [posX, setPosX] = useState(0);
    const meshRef = useRef<THREE.Mesh>(null!)

    /** 根据传入的排序下标，获取到 cube 所在的 X 坐标 */
    const getPosX = (sortIndex: number) => startPosX + (sortIndex * sortIndex);

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

        /** 监听水平移动 */
        const deltaX = Math.abs(oldPosX - targetPosX) / (config.animationSpeed / 20);
        // 如果当前 sortIndex 需要改变
        if (deltaX) {

            // mesh 需要往右移
            if (oldPosX - targetPosX < 0 && meshRef.current.position.x < targetPosX) {
                meshRef.current.translateX(deltaX);
                // setPosX(meshRef.current.position.x);
                if (meshRef.current.position.x >= targetPosX) {
                    meshRef.current.position.x = targetPosX;
                    // setPosX(meshRef.current.position.x);
                }
            }

            // mesh 需要往左移
            else if (oldPosX - targetPosX > 0 && meshRef.current.position.x > targetPosX) {
                meshRef.current.translateX(-deltaX);
                setPosX(meshRef.current.position.x);
                if (meshRef.current.position.x <= targetPosX) {
                    meshRef.current.position.x = targetPosX;
                    setPosX(meshRef.current.position.x);
                }
            }
        }


        /** 监听上下移动 */
        const deltaY = 0.2;

        if (moveTop) {
            // 如果要上移
            if (meshRef.current.position.y < 2) {
                meshRef.current.translateY(deltaY);
                setPosY(meshRef.current.position.y)
                if (meshRef.current.position.y >= 2) {
                    meshRef.current.position.y = 2;
                    setPosY(meshRef.current.position.y)
                }
            }

        }

        else if (moveDown) {
            // 如果要下移
            if (meshRef.current.position.y > 0) {
                meshRef.current.translateY(-deltaY);
                setPosY(meshRef.current.position.y)
                if (meshRef.current.position.y <= 0) {
                    meshRef.current.position.y = 0;
                    setPosY(meshRef.current.position.y)
                }
            }
        }
    })

    return (
        <>
            <Cube3d
                value={value}
                args={[2, 1, 1]}
                ref={meshRef}
            />
            {
                (arrowTo && !disappear) && <Arrow3d points={[[position[0] + 1, posY, position[2]], arrowTo]} />
            }
        </>
    )
}

LinkCube3d.defaultProps = {
    colorConfig: {
        defaultColor: 'wheat',
        activeColor: 'orange',
        hoverColor: 'skyblue',
        lockColor: '#8076a3'
    }
}

export default React.memo(LinkCube3d);