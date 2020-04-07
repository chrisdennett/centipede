import React, { useState } from "react";
import { saveAs } from "file-saver";
import { useInterval } from "./hooks/useInterval";
import Centipede from "./Centipede";
import { CentipedesSVG } from "./CentipedesSVG";

export const App = () => {
  const [showGrid, setShowGrid] = useState(false);
  const [doTimer, setDoTimer] = useState(false);
  const [inTestMode, setInTestMode] = useState(false);
  const [centipedes, setCentipedes] = useState([]);
  const [cells, setCells] = useState([]);

  const cellSize = 50;
  const width = 1000;
  const height = 1200;
  const svgWidth = width;
  const svgHeight = height;

  const toggleTestMode = () => setInTestMode((prev) => !prev);
  const toggleShowGrid = () => setShowGrid((prev) => !prev);

  useInterval(() => {
    if (doTimer) {
      regenerate();
    }
  }, 200);

  const regenerate = () => {
    setCells([]);
    setCentipedes([]);
  };

  // const cells = getCells({ cellSize, width, height });
  if (cells.length === 0) setCells(getCells({ cellSize, width, height }));

  if (cells.length > 0 && centipedes.length === 0)
    setCentipedes([
      <Centipede key={"0"} cells={cells} inTestMode={inTestMode} />,
    ]);

  const addCentipede = () => {
    setCentipedes((prevValue) => {
      return [
        ...prevValue,
        <Centipede
          key={prevValue.length + 1}
          cells={cells}
          inTestMode={inTestMode}
        />,
      ];
    });
  };

  return (
    <div>
      <button onClick={save_as_svg}>Save SVG</button>
      <button onClick={addCentipede}>Add Centipede</button>
      <button onClick={toggleShowGrid}>
        {showGrid ? "Hide" : "Show"} Grid
      </button>
      <button onClick={toggleTestMode}>
        Switch Test Mode {inTestMode ? "OFF" : "ON"}
      </button>
      {!inTestMode && (
        <>
          <button onClick={regenerate}>Regenerate</button>
          <button onClick={() => setDoTimer((prev) => !prev)}>Timer</button>
        </>
      )}
      <div>
        {cells.length > 0 && centipedes.length > 0 && (
          <CentipedesSVG
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            cells={cells}
            centipedes={centipedes}
            cellSize={cellSize}
            showGrid={showGrid}
          />
        )}
      </div>
    </div>
  );
};

const getCells = ({ cellSize, width, height }) => {
  const cells = [];
  const totalCols = Math.floor(width / cellSize);
  const totalRows = Math.floor(height / cellSize);
  let index = 0;
  const halfCell = cellSize / 2;
  const thirdCell = cellSize / 3;
  const twoThirdCell = thirdCell * 2;

  for (let yIndex = 0; yIndex < totalRows; yIndex++) {
    for (let xIndex = 0; xIndex < totalCols; xIndex++) {
      const x = xIndex * cellSize;
      const y = yIndex * cellSize;

      const indexLeft = xIndex === 0 ? -1 : index - 1;
      const indexRight = xIndex === totalCols - 1 ? -1 : index + 1;
      const indexAbove = yIndex === 0 ? -1 : index - totalCols;
      const indexBelow = yIndex === totalRows - 1 ? -1 : index + totalCols;
      const middleX = x + halfCell;
      const middleY = y + halfCell;
      const bottomY = y + cellSize;
      const rightX = x + cellSize;
      const thirdX = x + thirdCell;
      const thirdY = y + thirdCell;
      const twoThirdX = x + twoThirdCell;
      const twoThirdY = y + twoThirdCell;

      cells.push({
        x,
        y,
        index,
        thirdX,
        thirdY,
        twoThirdX,
        twoThirdY,
        cellSize,
        bottomY,
        rightX,
        middleX,
        middleY,
        indexLeft,
        indexRight,
        indexAbove,
        indexBelow,
        middleMiddle: `${x + halfCell},${y + halfCell}`,
        topMiddle: `${x + halfCell},${y}`,
        bottomMiddle: `${x + halfCell},${y + cellSize}`,
        leftMiddle: `${x},${y + halfCell}`,
        rightMiddle: `${x + cellSize},${y + halfCell}`,
      });

      index++;
    }
  }

  return cells;
};

const save_as_svg = () => {
  var full_svg = get_svg_text();
  var blob = new Blob([full_svg], { type: "image/svg+xml" });
  saveAs(blob, "virus-for-mag.svg");
};

const get_svg_text = () => {
  var svg_data = document.getElementById("svg")
    ? document.getElementById("svg").outerHTML
    : "waiting"; //put id of your svg element here

  svg_data = svg_data.split(">").join(`>
  `);

  return svg_data;
};
