import "./App.css";
import { Outlet } from "react-router-dom";
import ThemeToggleButton from "./components/ThemeToggleButton.tsx";

function App() {
  return (
    <>
      <ThemeToggleButton />
      <Outlet />
    </>
  );
}

export default App;
