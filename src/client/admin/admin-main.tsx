import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Login from "./pages/Login";
import AdminLayout from "./AdminLayout";
import InfoManagementPage from "./pages/InfoManagementPage";
import CardEditorPage from "./components/CardEditorPage";
import { infoListLoader, newInfoLoader, infoEntryLoader } from "./lib/loaders";
import ErrorBoundary from "../pages/ErrorBoundary";

const router = createBrowserRouter([ 
  {
    path: "admin",
    Component: AdminLayout,
    errorElement: <ErrorBoundary url="/admin/" />,
    children: [
        { 
          index: true, 
          element: <Navigate to="/admin/categories/students" replace />
        },
        {
          path: "categories/:category",
          children: [
            { 
              index: true, 
              element: <InfoManagementPage key="" />,
              loader: infoListLoader
            },
            { 
              path: "create",
              element: <CardEditorPage create={true} />, 
              loader: newInfoLoader
            },
            { 
              path: "edit/:id", 
              element: <CardEditorPage />, 
              loader: infoEntryLoader
            }
          ]
        }
      ],
  },
  {
    path: "admin/login",
    element: <Login />,
  }
], {
  basename: import.meta.env.VITE_BASE_URL
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
