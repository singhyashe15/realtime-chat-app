import { createBrowserRouter } from 'react-router-dom';
import Register from '../pages/register.jsx';
import Login from '../pages/login.jsx';
import OtpHandler from '../pages/otpHandler.jsx';
import Logout from '../pages/logout.jsx';
import Home from '../pages/home.jsx';
import MessagePage from '../components/messagePage.jsx';
import App from '../App.jsx';
import GroupMessagePage from '../components/groupMessagePage.jsx';
import ProtectedRoute from '../api/ProtectRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element:<App />,
    children: [
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'otp',
        element: <OtpHandler />
      },
      {
        path: 'logout',
        element: <Logout />
      },
      {    
            path : "",
            element :<ProtectedRoute><Home/></ProtectedRoute>,
            children : [
                {
                  path : ':opponentId',
                  element : <MessagePage/>
                },
                {
                  path: 'group/:groupId',
                  element : <GroupMessagePage/>
                }
            ]
            
        }
    ]
  }
])

export default router;