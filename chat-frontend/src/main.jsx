import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import router from './routes/route.jsx';
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ChakraProvider>
      <StrictMode>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </StrictMode>
    </ChakraProvider>
  </Provider>
)
