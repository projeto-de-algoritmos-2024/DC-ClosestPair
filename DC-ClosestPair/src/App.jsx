import { useState } from "react";
import "./App.css";

function App() {
  const [coorX, setCoorX] = useState(0);
  const [coorY, setCoorY] = useState(0);
  const [points, setPoints] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [closestPair, setClosestPair] = useState([]);
  const [minDistance, setMinDistance] = useState(0);

  const drawPoint = () => {
    if (coorX >= 0 && coorY >= 0 && coorX <= 1000 && coorY <= 700) {
      const newPoint = { x: parseFloat(coorX), y: parseFloat(coorY) };
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "blue";

      var circle = new Path2D();
      circle.moveTo(newPoint.x, newPoint.y);
      circle.arc(newPoint.x, newPoint.y, 10, 0, 2 * Math.PI);
      ctx.fill(circle);

      setPoints([...points, newPoint]);
    }
    setCoorX(0);
    setCoorY(0);
  };

  const findClosestPair = () => {
    let minDistance = Infinity;
    let closestPair = [];

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = Math.sqrt(
          Math.pow(points[j].x - points[i].x, 2) +
          Math.pow(points[j].y - points[i].y, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestPair = [points[i], points[j]];
        }
      }
    }

    if (closestPair.length === 2) {
      setClosestPair(closestPair);
      setMinDistance(minDistance);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
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
              onClick={drawPoint}
            >
              Adicionar ponto
            </button>
            {points.length > 2 ? (
              <button
                type="submit"
                className="addButton"
                onClick={findClosestPair}
              >
                Buscar par de pontos mais próximos
              </button>
            ) : (
              <div style={{ height: "2.5rem" }} />
            )}
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Pontos Mais Próximos</h2>
            <p>
              Os pontos mais próximos são: ({closestPair[0].x}, {closestPair[0].y}) e ({closestPair[1].x}, {closestPair[1].y}) 
              com uma distância de {minDistance.toFixed(2)}
            </p>
            <button onClick={closeModal} className="closeButton">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
