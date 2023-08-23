import { router } from '@/router'
import { Link, RouterProvider } from 'react-router-dom'

function App() {
  return (<div>
    <RouterProvider router={router} />
  </div>)
}

export default App
