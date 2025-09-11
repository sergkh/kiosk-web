import { createBrowserRouter, NavLink } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Login from "./pages/Login";

const router = createBrowserRouter([ 
  {
    path: "/admin",
    element: <div>
      Admin page 
      <NavLink to="/admin/login">Login</NavLink>
    </div>,
  },
  {
    path: "/admin/login",
    element: <div> <Login /> </div>,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
