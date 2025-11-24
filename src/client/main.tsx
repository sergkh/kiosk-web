import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import News from "./pages/News.tsx";
import Schedule from "./pages/Schedule.tsx";
import InfoCardsPage from "./pages/InfoCardsPage.tsx";
import Page from "./Page.tsx";
import DevelopersPage from "./pages/DevelopersPage.tsx";
import VideoPage from "./pages/VideoPage.tsx";
import ErrorBoundary from "./pages/ErrorBoundary.tsx";
// needed for i18n to work
import i18n from "./lib/locale.ts";
import IdlePage from "./pages/IdlePage.tsx";
import { infoCardsLoader } from "./lib/loaders.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page><News /></Page>,
    errorElement: <ErrorBoundary />,
    loader: infoCardsLoader('news')
  },
  {
    path: "/schedule",
    element: <Page><Schedule /></Page>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/students",
    element: <Page><InfoCardsPage key="students" title="title.students" /></Page>,
    errorElement: <ErrorBoundary />,
    loader: infoCardsLoader('students')
  }, 
  {
    path: "/abiturients",
    element: <Page><InfoCardsPage key="abiturients" title="title.abiturients" /></Page>,
    errorElement: <ErrorBoundary />,
    loader: infoCardsLoader('abiturients')
  },
  // {
  //   path: "/deligate",
  //   element: <Page><DeligatePage /></Page>
  // },
  {
    path: "/videos",
    element: <Page><VideoPage/></Page>,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/developers",
    element: <Page><DevelopersPage /></Page>,
    errorElement: <ErrorBoundary />
  },{
    path: "/idle",
    element: <IdlePage />,
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
