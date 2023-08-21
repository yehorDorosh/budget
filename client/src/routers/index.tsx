import { createBrowserRouter } from "react-router-dom";

import DefaultTemplate from "../components/templates/DefaultTemplate";
import SignupPage from "../components/pages/SignupPage";
import LoginPage from "../components/pages/LoginPage";
import HomePage from "../components/pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultTemplate />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      }
    ]
  }
])

export default router;