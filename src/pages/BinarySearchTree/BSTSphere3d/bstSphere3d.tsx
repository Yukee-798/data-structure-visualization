import React from "react";
import Line3d from "../../../components/Line3d/line3d";
import Sphere3d, { ISphere3dProps } from "../../../components/Sphere3d/sphere3d";

export interface IBSTSphere3dProps extends ISphere3dProps {
    /** 结点的实际顺序 */
    sortIndex?: number;
    /** 左线条位置 */
    lChildPos?: any;
    /** 右线条位置 */
    rChildPos?: any;
    /** 激活左线条 */
    activeLeft?: boolean;
    /** 激活右线条 */
    activeRight?: boolean;
}

const BSTCube3d: React.FC<IBSTSphere3dProps> = (props) => {

    const {
        lChildPos,
        rChildPos,
        isSpRev,
        position,
        activeLeft,
        activeRight
        // position,
        // value,
        // isActive,
        // isLock,
        // isSpRev,
        // colorConfig,
        // lChildPos,
        // rChildPos,
        // disappear,
        // sortIndex
    } = props;

    return (
        <>
            <Sphere3d
                {...props}
            />
            {
                lChildPos &&
                <Line3d
                    hidden={isSpRev as boolean}
                    points={[position, lChildPos]}
                    isActive={activeLeft}
                />
            }
            {
                rChildPos &&
                <Line3d
                    hidden={isSpRev as boolean}
                    points={[position, rChildPos]}
                    isActive={activeRight}
                />
            }
        </>
    )
}

export default BSTCube3d;