import { Outlet, RouterProvider } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'
function App() {
  return (
    <>
      <Toaster/>
      <Outlet />
    </>
  )
}

export default App
