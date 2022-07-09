import { ReactP5Wrapper } from "react-p5-wrapper"
import sketch from "./ParticleDrawer.ts";

function App() {
  return (
    <ReactP5Wrapper sketch={sketch} />
  );
}

export default App;
