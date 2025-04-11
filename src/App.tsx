import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CoursesGalleryPage from "./pages/CoursesGalleryPage.tsx";
import CourseCalculatorPage from "./pages/CourseCalculatorPage.tsx";
import ThemeToggleButton from "./components/ThemeToggleButton.tsx";

function App() {
  return (
    <BrowserRouter>
      <ThemeToggleButton />
      <Routes>
        <Route path="/" element={<CoursesGalleryPage />} />
        <Route path="/:from/:to" element={<CourseCalculatorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
