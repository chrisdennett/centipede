import React from "react";
import { saveAs } from "file-saver";

const cellSize = 50;
const width = 600;
const height = 600;
const svgWidth = width;
const svgHeight = height;

export default () => {
  const [gridData, setDataGrid] = React.useState(
    getGridData({ cellSize, width, height })
  );
  const [centepedePaths, setCentepedePaths] = React.useState(
    getCentipedePath(gridData)
  );

  const regenerate = () => {
    const freshGrid = getGridData({ cellSize, width, height });
    setDataGrid(freshGrid);
    setCentepedePaths(getCentipedePath(freshGrid));
  };

  return (
    <div>
      <button onClick={save_as_svg}>Save SVG</button>
      <button onClick={regenerate}>Regenerate</button>
      <svg
        id="svg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ border: "1px solid black" }}
        width={svgWidth}
        height={svgHeight}
        fill={"none"}
        stroke={"black"}
        strokeWidth={2}
      >
        {gridData.map((cell, index) => (
          <rect
            key={index}
            x={cell.x}
            y={cell.y}
            width={cellSize}
            height={cellSize}
            stroke="red"
          />
        ))}

        {centepedePaths}
      </svg>
    </div>
  );
};

const getAvailableNeighbourOptions = (cell, cells) => {
  // get index above, below, left and right
  // return available array of "left", "right", "Top", "bottom"
  const { indexAbove, indexBelow, indexLeft, indexRight } = cell;

  const possOptions = [];

  if (indexAbove >= 0 && !cells[indexAbove].endedOn) {
    possOptions.push(["top", indexAbove]);
  } else {
    console.log("GET NEIGHBOUR", "top", indexAbove, cells[indexAbove]);
  }

  if (indexBelow >= 0 && !cells[indexBelow].endedOn) {
    possOptions.push(["bottom", indexBelow]);
  } else {
    console.log("GET NEIGHBOUR", "bottom", indexBelow, cells[indexBelow]);
  }

  if (indexLeft >= 0 && !cells[indexLeft].endedOn) {
    possOptions.push(["left", indexLeft]);
  } else {
    console.log("GET NEIGHBOUR", "left", indexLeft, cells[indexLeft]);
  }

  if (indexRight >= 0 && !cells[indexRight].endedOn) {
    possOptions.push(["right", indexRight]);
  } else {
    console.log("GET NEIGHBOUR", "right", indexRight, cells[indexRight]);
  }

  if (possOptions.length === 0) return null;

  // get random option from those available
  const randIndex = getRandomIntBetween(0, possOptions.length - 1);
  const randOption = possOptions[randIndex];

  return randOption;
};

const drawCurrCellPath = ({ cell, option, prevCellEndedOn }) => {
  let centepedePath = "";

  if (option) {
    if (prevCellEndedOn === "right") {
      if (option === "right") {
        centepedePath += drawLeftToRight(cell);
      }
      if (option === "bottom") {
        centepedePath += drawLeftToBottom(cell);
      }
      if (option === "top") {
        centepedePath += drawLeftToTop(cell);
      }
    }

    if (prevCellEndedOn === "bottom") {
      if (option === "right") {
        centepedePath += drawTopToRight(cell);
      }
      if (option === "bottom") {
        centepedePath += drawTopToBottom(cell);
      }
      if (option === "left") {
        centepedePath += drawTopToLeft(cell);
      }
    }

    if (prevCellEndedOn === "top") {
      if (option === "right") {
        centepedePath += drawBottomToRight(cell);
      }
      if (option === "top") {
        centepedePath += drawBottomToTop(cell);
      }
      if (option === "left") {
        centepedePath += drawBottomToLeft(cell);
      }
    }

    if (prevCellEndedOn === "left") {
      if (option === "left") {
        centepedePath += drawRightToLeft(cell);
      }
      if (option === "bottom") {
        centepedePath += drawRightToBottom(cell);
      }
      if (option === "top") {
        centepedePath += drawRightToTop(cell);
      }
    }
  }

  return centepedePath;
};

const getCentipedePath = (cells) => {
  const paths = [];

  let firstCellIndex = 0;
  let prevCellEndedOn = "right";
  let cell = cells[firstCellIndex];
  let randomNeighBourOption = getAvailableNeighbourOptions(cell, cells);

  if (!randomNeighBourOption) return "";

  let option = randomNeighBourOption[0];
  cell.endedOn = option;
  let nextCellIndex = randomNeighBourOption[1];

  let d = drawCurrCellPath({
    cell,
    option,
    isStart: true,
    prevCellEndedOn,
  });
  prevCellEndedOn = option;
  paths.push(<path d={d} key={paths.length} />);

  // Two
  let count = 0;
  let endReached = false;

  while (endReached === false && count < 3000) {
    cell = cells[nextCellIndex];
    randomNeighBourOption = getAvailableNeighbourOptions(cell, cells);

    if (randomNeighBourOption === null) {
      endReached = true;
      break;
    } else {
      option = randomNeighBourOption[0];
      cell.endedOn = option;
      nextCellIndex = randomNeighBourOption[1];

      const d = drawCurrCellPath({
        cell,
        option,
        isStart: true,
        prevCellEndedOn,
      });

      paths.push(<path d={d} key={paths.length} />);

      prevCellEndedOn = option;
    }

    count++;
  }

  return paths;
};

// DRAW START
const drawStartInCell = (cell, drawFunction, key) => {
  const d = drawFunction(cell, true);
  return [
    <path d={d} key={key} />,
    <circle cx={cell.middleX} cy={cell.middleY} r={10} />,
    <circle cx={cell.middleX} cy={cell.middleY} r={2} />,
  ];
};

// DRAW END
const drawEndInCell = (cell, drawFunction, key) => {
  const d = drawFunction(cell, true);
  return [
    <path d={d} key={key} />,
    <circle cx={cell.middleX} cy={cell.middleY} r={5} />,
    <circle cx={cell.middleX} cy={cell.middleY} r={2} />,
  ];
};

// DRAW MIDDLE
const drawPartInCell = (cell, drawFunction, key) => {
  const d = drawFunction(cell, true);
  return <path d={d} key={key} />;
};

// From LEFT
const drawLeftToRight = (cell) => {
  let p = `M ${cell.leftMiddle} `;
  p += ` L ${cell.rightMiddle} `;
  return p;
};

const drawLeftToBottom = (cell) => {
  let p = `M ${cell.leftMiddle} `;
  p += ` L ${cell.bottomMiddle} `;
  return p;
};

const drawLeftToTop = (cell) => {
  let p = `M ${cell.leftMiddle} `;
  p += ` L ${cell.topMiddle} `;
  return p;
};

// FROM TOP
const drawTopToBottom = (cell) => {
  let p = `M ${cell.topMiddle} `;
  p += ` L ${cell.bottomMiddle} `;
  return p;
};
const drawTopToLeft = (cell) => {
  let p = `M ${cell.topMiddle} `;
  p += ` L ${cell.leftMiddle} `;
  return p;
};
const drawTopToRight = (cell) => {
  let p = `M ${cell.topMiddle} `;
  p += ` L ${cell.rightMiddle} `;
  return p;
};

// FROM RIGHT
const drawRightToBottom = (cell) => {
  let p = `M ${cell.rightMiddle} `;
  p += ` L ${cell.bottomMiddle} `;
  return p;
};
const drawRightToLeft = (cell) => {
  let p = `M ${cell.rightMiddle} `;
  p += ` L ${cell.leftMiddle} `;
  return p;
};
const drawRightToTop = (cell) => {
  let p = `M ${cell.rightMiddle} `;
  p += ` L ${cell.topMiddle} `;
  return p;
};

// FROM BOTTOM
const drawBottomToRight = (cell) => {
  let p = `M ${cell.bottomMiddle} `;
  p += ` L ${cell.rightMiddle} `;
  return p;
};
const drawBottomToLeft = (cell) => {
  let p = `M ${cell.bottomMiddle} `;
  p += ` L ${cell.leftMiddle} `;
  return p;
};
const drawBottomToTop = (cell) => {
  let p = `M ${cell.bottomMiddle} `;
  p += ` L ${cell.topMiddle} `;
  return p;
};

const getGridData = ({ cellSize, width, height }) => {
  const cells = [];
  const totalCols = Math.floor(width / cellSize);
  const totalRows = Math.floor(height / cellSize);
  let index = 0;
  const halfCell = cellSize / 2;

  for (let yIndex = 0; yIndex < totalRows; yIndex++) {
    for (let xIndex = 0; xIndex < totalCols; xIndex++) {
      const x = xIndex * cellSize;
      const y = yIndex * cellSize;

      const indexLeft = xIndex === 0 ? -1 : index - 1;
      const indexRight = xIndex === totalCols - 1 ? -1 : index + 1;
      const indexAbove = yIndex === 0 ? -1 : index - totalCols;
      const indexBelow = yIndex === totalRows - 1 ? -1 : index + totalCols;

      cells.push({
        x,
        y,
        index,
        indexLeft,
        indexRight,
        indexAbove,
        indexBelow,
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

const getRandomIntBetween = (min, max) => {
  // return Math.round(min + (max - min) * Math.random());
  return Math.round(Math.random() * max);
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
