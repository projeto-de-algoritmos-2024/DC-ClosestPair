import { useState } from "react";
import "./App.css";

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// [Distancia, coorX, coorY]
var AUX_CLOSEST_PAIR = [];

function App() {
  const [coorX, setCoorX] = useState(0);
  const [coorY, setCoorY] = useState(0);
  const [points, setPoints] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [closestPair, setClosestPair] = useState([]);
  const [minDistance, setMinDistance] = useState(0);

  // --------- Versão em força bruta ---------
  // const findClosestPair = () => {
  //   let minDistance = Infinity;
  //   let closestPair = [];

  //   for (let i = 0; i < points.length; i++) {
  //     for (let j = i + 1; j < points.length; j++) {
  //       const distance = Math.sqrt(
  //         Math.pow(points[j].x - points[i].x, 2) +
  //           Math.pow(points[j].y - points[i].y, 2)
  //       );

  //       if (distance < minDistance) {
  //         minDistance = distance;
  //         closestPair = [points[i], points[j]];
  //       }
  //     }
  //   }

  //   if (closestPair.length === 2) {
  //     setClosestPair(closestPair);
  //     setMinDistance(minDistance);
  //     setModalVisible(true);
  //   }
  // };

  // Cria um novo ponto e o coloca no Canvas
  const drawPoint = () => {
    if (coorX >= 0 && coorY >= 0 && coorX <= 1000 && coorY <= 700) {
      const newPoint = new Point(parseFloat(coorX), parseFloat(coorY));
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "blue";

      var circle = new Path2D();
      circle.moveTo(newPoint.x, newPoint.y);
      circle.arc(newPoint.x, newPoint.y, 10, 0, 2 * Math.PI);
      ctx.fill(circle);

      ctx.fillText(
        `(${newPoint.x}, ${newPoint.y})`,
        newPoint.x - 20,
        newPoint.y + 20
      );

      setPoints([...points, newPoint]);
    }
    setCoorX(0);
    setCoorY(0);
  };

  // Ordenação em X
  const sortX = (point1, point2) => {
    return point1.x - point2.x;
  };

  // Ordenação em Y
  const sortY = (point1, point2) => {
    return point1.y - point2.y;
  };

  // Distância entre dois pontos
  const findDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  };

  // Método força bruta para achar a menor distância quando a quantidade de pontos é pequena
  const bruteForce = (P, n) => {
    var min = Number.POSITIVE_INFINITY;

    for (var i = 0; i < n; ++i) {
      for (var j = i + 1; j < n; ++j) {
        if (findDistance(P[i], P[j]) < min) {
          min = findDistance(P[i], P[j]);
          AUX_CLOSEST_PAIR.push([min, P[i], P[j]]);
          console.log(AUX_CLOSEST_PAIR);
        }
      }
    }
    return min;
  };

  // Comparar com os próximos pontos em uma faixa e retornar os pontos mais próximos
  const stripClosest = (strip, size, d) => {
    var min = d;
    strip.sort(sortY);

    for (var i = 0; i < size; ++i) {
      for (var j = i + 1; j < size && strip[j].y - strip[i].y < min; ++j) {
        if (findDistance(strip[i], strip[j]) < min) {
          min = findDistance(strip[i], strip[j]);
          AUX_CLOSEST_PAIR.push([min, strip[i], strip[j]]);
          console.log(AUX_CLOSEST_PAIR);
        }
      }
    }
    return min;
  };

  // Função recursiva usada para encontrar os pontos mais próximos
  const closestUtil = (P, n) => {
    // Usar força bruta quando tem 2 ou 3 pontos
    if (n <= 3) {
      return bruteForce(P, n);
    }

    // Acha o ponto do meio
    var mid = Math.floor(n / 2);
    var midPoint = P[mid];

    // Chama recursivamente para os dois lados
    var dl = closestUtil(P, mid);
    var dr = closestUtil(P.slice(mid), n - mid);

    // Verifica qual dos dois lados tem a menor distância
    var d = Math.min(dl, dr);

    // Monta a faixa de pontos próximos
    var strip = [];
    var j = 0;
    for (var i = 0; i < n; i++) {
      if (Math.abs(P[i].x - midPoint.x) < d) {
        strip[j] = P[i];
        j++;
      }
    }

    // Compara os pontos mais próximos dentro da faixa com os pontos mais próximos fora dela
    var distance = Math.min(d, stripClosest(strip, j, d));

    return distance;
  };

  // Ordena em X e começa a busca pelos pontos mais próximos
  const findClosestPair = () => {
    var P = points;
    P.sort(sortX);

    var auxMinDistance = closestUtil(P, P.length);
    if (auxMinDistance != minDistance) {
      for (let i = 0; i < AUX_CLOSEST_PAIR.length; i++) {
        if (AUX_CLOSEST_PAIR[i][0] == auxMinDistance) {
          setClosestPair([AUX_CLOSEST_PAIR[i][1], AUX_CLOSEST_PAIR[i][2]]);
        }
      }
      setMinDistance(auxMinDistance);
    }
    setModalVisible(true);
  };

  // Fecha o modal de resultado
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
            <button type="submit" className="addButton" onClick={drawPoint}>
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
            <h2 style={{ color: "blueviolet" }}>Pontos Mais Próximos</h2>
            <p style={{ color: "blueviolet" }}>
              Os pontos mais próximos são: ({closestPair[0].x},{" "}
              {closestPair[0].y}) e ({closestPair[1].x}, {closestPair[1].y}) com
              uma distância de {minDistance.toFixed(2)}
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
