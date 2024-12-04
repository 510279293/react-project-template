import { Provider } from 'react-redux'
import { AppRouterProvider } from '@/router'
import { Init as AppInit } from './components'
import store from './store'

function App() {
  return (<Provider store={store}>
            <AppInit>
              <AppRouterProvider />
            </AppInit>
          </Provider>)
}

export default App
