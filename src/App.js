import { ReactP5Wrapper } from "react-p5-wrapper"
import { isPropertySignature } from "typescript";
import { useState } from "react";

function App() {
  const [sketch, setSketch] = useState();

  return (
    <div>
      <header>
        <h1>Joshua Walton</h1>
      </header>

      <div>
        <ReactP5Wrapper sketch={import('./ConstraintSketch')} />
      </div>
    </div>
  );
}

function SketchComponent(props) {
  return(
    <div>
      <ReactP5Wrapper sketch={props.sketch} />
    </div>
  )
}

export default App;
