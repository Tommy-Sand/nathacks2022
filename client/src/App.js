import "./App.css";
import Fireflies from "./components/fireflies";
import Form from "./components/form";
import SoundController from "./components/soundPlayer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/mountains" element={<Fireflies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
