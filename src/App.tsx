import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CoursesGalleryPage from "./pages/CoursesGalleryPage.tsx";
import CourseCalculatorPage from "./pages/CourseCalculatorPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoursesGalleryPage />} />
        <Route path="/:from/:to" element={<CourseCalculatorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
