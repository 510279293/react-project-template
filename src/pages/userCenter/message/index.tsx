// import { Outlet } from '@/components';

import { Outlet } from 'react-router-dom';

export { default as Station } from './station';

function Message() {
    return <Outlet />
}

export default Message