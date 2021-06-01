import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Line3d from "../../../components/Line3d/line3d";
import Sphere3d, { ISphere3dProps } from "../../../components/Sphere3d/sphere3d";
import config, { cdnOfNodes } from '../config'

export interface IBinaryHeapSphere3dProps extends ISphere3dProps { }

const BSTSphere3d: React.FC<IBinaryHeapSphere3dProps> = (props) => {

    const {
        lChildPos,
        rChildPos,
        position,
        activeLeft,
        activeRight,
        disappear,
        sortIndex,
        sortIndexes,
        // position,
        // value,
        // isActive,
        // isLock,
        // colorConfig,
        // lChildPos,
        // rChildPos,
        // disappear,
        // sortIndex
    } = props;

    const meshRef = useRef<THREE.Mesh>(null!)

    const oldPosX = cdnOfNodes[sortIndex][0];
    const oldPosY = cdnOfNodes[sortIndex][1];

    const targetPosX = cdnOfNodes[sortIndexes[sortIndexes.length - 1]][0];
    const targetPosY = cdnOfNodes[sortIndexes[sortIndexes.length - 1]][1];

    useFrame(() => {
        const deltaX = Math.abs(oldPosX - targetPosX) / (config.animationSpeed / 20);
        const deltaY = Math.abs(oldPosY - targetPosY) / (config.animationSpeed / 20);

        // 如果当前sphere需要水平移动
        if (deltaX) {

            // sphere 需要往右移
            if (oldPosX - targetPosX < 0 && meshRef.current.position.x < targetPosX) {
                meshRef.current.translateX(deltaX);
                if (meshRef.current.position.x >= targetPosX) {
                    meshRef.current.position.x = targetPosX;
                }
            }

            // sphere 需要往左移
            else if (oldPosX - targetPosX > 0 && meshRef.current.position.x > targetPosX) {
                meshRef.current.translateX(-deltaX);
                if (meshRef.current.position.x <= targetPosX) {
                    meshRef.current.position.x = targetPosX;
                }
            }
        }

        // 如果当前sphere需要竖直移动
        if (deltaY) {

            // sphere 需要往上移
            if (oldPosY - targetPosY < 0 && meshRef.current.position.y < targetPosY) {
                meshRef.current.translateY(deltaY);
                if (meshRef.current.position.y >= targetPosY) {
                    meshRef.current.position.y = targetPosY;
                }
            }

            // sphere 需要往下移
            else if (oldPosY - targetPosY > 0 && meshRef.current.position.y > targetPosY) {
                meshRef.current.translateY(-deltaY);
                if (meshRef.current.position.y <= targetPosY) {
                    meshRef.current.position.y = targetPosY;
                }
            }
        }
    })

    return (
        <>
            <Sphere3d
                ref={meshRef as any}
                {...props}
            />
            {
                lChildPos &&
                <Line3d
                    hidden={disappear as boolean}
                    points={[position, lChildPos]}
                    isActive={activeLeft}
                />
            }
            {
                rChildPos &&
                <Line3d
                    hidden={disappear as boolean}
                    points={[position, rChildPos]}
                    isActive={activeRight}
                />
            }
        </>
    )
}

export default BSTSphere3d;