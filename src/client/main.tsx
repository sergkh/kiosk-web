import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import News from "./pages/News.tsx";
import Schedule from "./pages/Schedule.tsx";
import StudentInfoPage from "./pages/StudentInfoPage.tsx";
import Page from "./Page.tsx";
import DevelopersPage from "./pages/DevelopersPage.tsx";
import ErrorBoundary from "./pages/ErrorBoundary.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page><News /></Page>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/schedule",
    element: <Page><Schedule /></Page>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/students",
    element: <Page><StudentInfoPage /></Page>,
    errorElement: <ErrorBoundary />
  },  
  {
    path: "/developers",
    element: <Page><DevelopersPage /></Page>,
    errorElement: <ErrorBoundary />
  },
], {
  basename: import.meta.env.VITE_BASE_URL
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
