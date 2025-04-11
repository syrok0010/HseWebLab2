import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThemeToggleButton from "./components/ThemeToggleButton.tsx";
import LoadingSpinner from "./components/LoadingSpinner.tsx";

const CoursesGalleryPage = React.lazy(
  () => import("./pages/CoursesGalleryPage.tsx"),
);
const CourseCalculatorPage = React.lazy(
  () => import("./pages/CourseCalculatorPage.tsx"),
);

const LoadingFallback: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <LoadingSpinner size="large" overlay={true}></LoadingSpinner>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeToggleButton />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<CoursesGalleryPage />} />
          <Route path="/:from/:to" element={<CourseCalculatorPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
