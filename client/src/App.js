import "./App.css";
import Fireflies from "./components/fireflies";
import Form from "./components/form";
import SoundController from "./components/soundPlayer";

function App() {
  return (
    <div>
      <Fireflies />
      <SoundController />
    </div>
  );
}

export default App;
