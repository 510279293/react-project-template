import './index.less'
import { login } from '@/api'
export default () => {
    return (<div className='test'>
        hello, i am test
        <button onClick={login}>点我调用接口</button>
    </div>)
}
