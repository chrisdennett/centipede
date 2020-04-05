import React, { useState } from "react";
import { saveAs } from "file-saver";
import { useInterval } from "./hooks/useInterval";
import Centipede from "./Centipede";

export default () => {
  const [doTimer, setDoTimer] = useState(false);
  const [inTestMode, setInTestMode] = useState(true);
  const [strokeColour, setStrokeColour] = useState("#ccc");
  const cellSize = 50;
  const width = 500;
  const height = 500;
  const svgWidth = width;
  const svgHeight = height;

  const toggleTestMode = () => setInTestMode((prev) => !prev);

  useInterval(() => {
    if (doTimer) {
      regenerate();
    }
  }, 200);

  const regenerate = () => {
    setStrokeColour((prev) => (prev === "#ccc" ? "#cccccd" : "#ccc"));
  };

  const cells = getGridData({ cellSize, width, height });

  return (
    <div>
      <button onClick={save_as_svg}>Save SVG</button>
      <button onClick={toggleTestMode}>
        Switch Test Mode {inTestMode ? "OFF" : "ON"}
      </button>
      {!inTestMode && (
        <>
          <button onClick={regenerate}>Regenerate</button>
          <button onClick={() => setDoTimer((prev) => !prev)}>Timer</button>
        </>
      )}
      <svg
        id="svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ border: "1px solid black" }}
        width={svgWidth}
        height={svgHeight}
        fill={"none"}
        stroke={"red"}
        strokeWidth={2}
      >
        {cells.map((cell, index) => (
          <rect
            key={"grid" + index}
            x={cell.x}
            y={cell.y}
            width={cellSize}
            height={cellSize}
            stroke={strokeColour}
          />
        ))}

        <Centipede cells={cells} inTestMode={inTestMode} />
      </svg>
    </div>
  );
};

const getGridData = ({ cellSize, width, height }) => {
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
