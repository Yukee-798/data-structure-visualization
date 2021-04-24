import { IBaseProps } from '../../types'
import './hello.scss'


interface IHelloProps extends IBaseProps {

}

const Hello: React.FC<IHelloProps> = () => {
    return (
        <div>hello</div>
    )
}

export default Hello;