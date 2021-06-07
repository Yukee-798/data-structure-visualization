import { ISpherePageConfig } from "../../types";
import { Points } from "../../types";

let config: ISpherePageConfig = {
    geoBaseDistance: 2,
    geoNumRange: [5, 10],
    geoValueRange: [10, 70],
    geoBasePosY: 3,
    cameraPosZ: 21,
    animationSpeed: 400,
    maxDeepth: 3
}

/** 满二叉树的各点坐标 */
export const cdnOfNodes: Points = [
    // 第一排
    [0, 5 + config.geoBasePosY, 0],
    // 第二排
    [-4, 2 + config.geoBasePosY, 0], [4, 2 + config.geoBasePosY, 0],
    // 第三排
    [-6, -1 + config.geoBasePosY, 0], [-2, -1 + config.geoBasePosY, 0], [2, -1 + config.geoBasePosY, 0], [6, -1 + config.geoBasePosY, 0],
    // 第四排
    [-7, -4 + config.geoBasePosY, 0], [-5, -4 + config.geoBasePosY, 0], [-3, -4 + config.geoBasePosY, 0], [-1, -4 + config.geoBasePosY, 0], [1, -4 + config.geoBasePosY, 0], [3, -4 + config.geoBasePosY, 0], [5, -4 + config.geoBasePosY, 0], [7, -4 + config.geoBasePosY, 0]
]

export default config;