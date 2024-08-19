import { useState } from "react";
import "./App.css";

function App() {
  const [coorX, setCoorX] = useState(0);
  const [coorY, setCoorY] = useState(0);
  const [qtdOfPoints, setQtdOfPoints] = useState(0);

  const drawPoint = () => {
    if (coorX >= 0 && coorY >= 0 && coorX <= 1000 && coorY <= 700) {
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "blue";

      var circle = new Path2D();
      circle.moveTo(coorX, coorY);
      circle.arc(coorX, coorY, 10, 0, 2 * Math.PI);
      ctx.fill(circle);

      setQtdOfPoints(qtdOfPoints + 1);
    }
    setCoorX(0);
    setCoorY(0);
  };

  return (
    <div className="appContainer">
      <div className="firstHalf">
        <canvas
          id="canvas"
          className="canvasStyle"
          width="1000"
          height="700"
        ></canvas>
      </div>

      <div className="secondHalf">
        <div className="pointForms">
          <p className="instruction">
            Adicione pontos ao Canvas:{" "}
            <p className="observation">{"(X -> 0 à 1000)"}</p>
            <p className="observation">{"(Y -> 0 à 700)"}</p>
          </p>
          <label>Coordenada X</label>
          <input
            type="number"
            value={coorX}
            onChange={(e) => setCoorX(e.target.value)}
          ></input>

          <label>Coordenada Y</label>
          <input
            type="number"
            value={coorY}
            onChange={(e) => setCoorY(e.target.value)}
          ></input>

          <div className="buttonContainer">
            <button
              type="submit"
              className="addButton"
              onClick={() => drawPoint()}
            >
              Adicionar ponto
            </button>
            {qtdOfPoints > 2 ? (
              <button
                type="submit"
                className="addButton"
                // onClick={() => drawPoint()}
              >
                Buscar par de pontos mais próximos
              </button>
            ) : (
              <div style={{ height: "2.5rem" }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
