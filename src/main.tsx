import React, { Suspense } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import { calculatorLoader, galleryLoader } from "./loaders.ts";

const CoursesGalleryPage = React.lazy(
  () => import("./pages/CoursesGalleryPage.tsx"),
);
const CourseCalculatorPage = React.lazy(
  () => import("./pages/CourseCalculatorPage.tsx"),
);

const repositoryName = "HseWebLab2";
const routerBasename = `/${repositoryName}/`;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          loader: galleryLoader,
          element: (
            <Suspense fallback={<LoadingSpinner overlay={true} size="large" />}>
              <CoursesGalleryPage />
            </Suspense>
          ),
        },
        {
          path: "/:from/:to",
          loader: calculatorLoader,
          element: (
            <Suspense fallback={<LoadingSpinner overlay={true} size="large" />}>
              <CourseCalculatorPage />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    basename: routerBasename,
  },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
