import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Login from "./pages/Login";
import AdminLayout from "./AdminLayout";
import StudentsPage from "./pages/StudentsPage";
import AbiturientsPage from "./pages/AbiturientsPage";
import CardEditorPage, { EditCardType } from "./components/CardEditorPage";
import { studInfoLoader, newStudInfoLoader, newAbiturientInfoLoader, abiturientInfoLoader } from "./lib/loaders";
import ErrorBoundary from "../pages/ErrorBoundary";

const router = createBrowserRouter([ 
  {
    path: "admin",
    Component: AdminLayout,
    errorElement: <ErrorBoundary url="/admin/" />,
    children: [
        { 
          index: true, 
          Component: StudentsPage 
        },
        { 
          path: "students", 
          children: [
            { index: true, Component: StudentsPage },
            { 
              path: "create", 
              element: <CardEditorPage type={EditCardType.Student} create={true} />, 
              loader: newStudInfoLoader
            },
            {
              path: "edit/:id", 
              element: <CardEditorPage type={EditCardType.Student} />, 
              loader: studInfoLoader
            }
          ]
        },
        { 
          path: "abiturients", 
          children: [
            { index: true, Component: AbiturientsPage },
            { 
              path: "create", 
              element: <CardEditorPage type={EditCardType.Abiturient} create={true} />, 
              loader: newAbiturientInfoLoader
            },
            { 
              path: "edit/:id", 
              element: <CardEditorPage type={EditCardType.Abiturient} />, 
              loader: abiturientInfoLoader
            }
          ]
        },
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
