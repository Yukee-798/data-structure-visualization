import { useEffect } from 'react';
import { Html, useProgress } from '@react-three/drei';
import { Spin } from 'antd';

export function SceneLoader(props: any) {
    const { progress } = useProgress();
    const { onLoaded } = props;
    useEffect(() => {
        if (progress === 100) {
            onLoaded?.();
        }
    }, [progress])

    return (
        <Html center style={{ marginTop: '200px' }}>
            <Spin size='large' />
            {/* {progress} % loaded */}
        </Html>
    );
}






