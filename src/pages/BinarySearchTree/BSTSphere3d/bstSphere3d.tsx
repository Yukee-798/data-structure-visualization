import React from "react";
import Line3d from "../../../components/Line3d/line3d";
import Sphere3d, { ISphere3dProps } from "../../../components/Sphere3d/sphere3d";

export interface IBSTSphere3dProps extends ISphere3dProps { }

const BSTSphere3d: React.FC<IBSTSphere3dProps> = (props) => {

    const {
        lChildPos,
        rChildPos,
        position,
        activeLeft,
        activeRight,
        disappear
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

    return (
        <>
            <Sphere3d
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