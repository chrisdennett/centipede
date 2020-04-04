import React from "react";
import { saveAs } from "file-saver";
import { useAnimationFrame } from "./hooks/useAnimationFrame";

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
  const [count, setCount] = React.useState(0);

  // useAnimationFrame((deltaTime) => {
  //   // Pass on a function to the setter of the state
  //   // to make sure we always have the latest state
  //   setCount((prevCount) => prevCount + 1);
  //   regenerate();
  // });

  const regenerate = () => {
    const freshGrid = getGridData({ cellSize, width, height });
    setDataGrid(freshGrid);
    setCentepedePaths(getCentipedePath(freshGrid));
  };

  return (
    <div>
      {count}
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
            key={"grid" + index}
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

const getCentipedePath = (cells) => {
  const paths = [];
  let count = 0;
  let endReached = false;
  let nextCellIndex = getRandomIntBetween(0, cells.length - 1);
  let prevCellEndedOn;

  while (endReached === false && count < 3000) {
    const cell = cells[nextCellIndex];
    const randomNeighBourOption = getAvailableNeighbourOptions(cell, cells);

    if (randomNeighBourOption === null) {
      endReached = true;
      break;
    } else {
      const option = randomNeighBourOption[0];
      cell.endedOn = option;
      nextCellIndex = randomNeighBourOption[1];

      const segment = drawCurrCellPath({
        cell,
        option,
        prevCellEndedOn,
      });

      paths.push(segment);

      prevCellEndedOn = option;
    }

    count++;
  }

  return paths;
};

const getAvailableNeighbourOptions = (cell, cells) => {
  const { indexAbove, indexBelow, indexLeft, indexRight } = cell;

  const possOptions = [];

  if (indexAbove >= 0 && !cells[indexAbove].endedOn) {
    possOptions.push(["top", indexAbove]);
  } else {
    // console.log("GET NEIGHBOUR", "top", indexAbove, cells[indexAbove]);
  }

  if (indexBelow >= 0 && !cells[indexBelow].endedOn) {
    possOptions.push(["bottom", indexBelow]);
  } else {
    // console.log("GET NEIGHBOUR", "bottom", indexBelow, cells[indexBelow]);
  }

  if (indexLeft >= 0 && !cells[indexLeft].endedOn) {
    possOptions.push(["left", indexLeft]);
  } else {
    // console.log("GET NEIGHBOUR", "left", indexLeft, cells[indexLeft]);
  }

  if (indexRight >= 0 && !cells[indexRight].endedOn) {
    possOptions.push(["right", indexRight]);
  } else {
    // console.log("GET NEIGHBOUR", "right", indexRight, cells[indexRight]);
  }

  if (possOptions.length === 0) return null;

  // get random option from those available
  const randIndex = getRandomIntBetween(0, possOptions.length - 1);
  const randOption = possOptions[randIndex];

  return randOption;
};

const drawCurrCellPath = ({ cell, option, prevCellEndedOn }) => {
  let path;
  if (!option) return null;

  // HEAD SEGMENT
  if (!prevCellEndedOn) {
    if (option === "right") {
      path = drawStartToRight(cell);
    }

    if (option === "left") {
      path = drawStartToLeft(cell);
    }
    if (option === "bottom") {
      path = drawStartToBottom(cell);
    }
    if (option === "top") {
      path = drawStartToTop(cell);
    }

    return drawHead(cell, path, cell.index);
  }

  // MIDDLE SEGMENTS
  if (prevCellEndedOn === "right") {
    if (option === "right") {
      path = drawLeftToRight(cell);
    }
    if (option === "bottom") {
      path = drawLeftToBottom(cell);
    }
    if (option === "top") {
      path = drawLeftToTop(cell);
    }
  }

  if (prevCellEndedOn === "bottom") {
    if (option === "right") {
      path = drawTopToRight(cell);
    }
    if (option === "bottom") {
      path = drawTopToBottom(cell);
    }
    if (option === "left") {
      path = drawTopToLeft(cell);
    }
  }

  if (prevCellEndedOn === "top") {
    if (option === "right") {
      path = drawBottomToRight(cell);
    }
    if (option === "top") {
      path = drawBottomToTop(cell);
    }
    if (option === "left") {
      path = drawBottomToLeft(cell);
    }
  }

  if (prevCellEndedOn === "left") {
    if (option === "left") {
      path = drawRightToLeft(cell);
    }
    if (option === "bottom") {
      path = drawRightToBottom(cell);
    }
    if (option === "top") {
      path = drawRightToTop(cell);
    }
  }

  return drawMiddle(path, cell.index);
};

// DRAW START
const drawHead = (cell, path, key) => {
  return (
    <g key={key}>
      <path d={path} />,
      <circle cx={cell.middleX} cy={cell.middleY} r={10} />,
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />,
    </g>
  );
};

// DRAW END
const drawTail = (cell, path, key) => {
  return (
    <g key={key}>
      <path d={path} key={key} />,
      <circle cx={cell.middleX} cy={cell.middleY} r={5} />,
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />,
    </g>
  );
};

// DRAW MIDDLE
const drawMiddle = (path, key) => {
  return <path d={path} key={key} />;
};

// STARTS
const drawStartToRight = (cell) => {
  let p = `M ${cell.middleMiddle} `;
  p += ` L ${cell.rightMiddle} `;
  return p;
};
const drawStartToLeft = (cell) => {
  let p = `M ${cell.middleMiddle} `;
  p += ` L ${cell.leftMiddle} `;
  return p;
};
const drawStartToTop = (cell) => {
  let p = `M ${cell.middleMiddle} `;
  p += ` L ${cell.topMiddle} `;
  return p;
};
const drawStartToBottom = (cell) => {
  let p = `M ${cell.middleMiddle} `;
  p += ` L ${cell.bottomMiddle} `;
  return p;
};

// ENDS
const drawEndFromTop = (cell) => {
  let p = `M ${cell.topMiddle} `;
  p += ` L ${cell.middleMiddle} `;
  return p;
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
      const middleX = x + halfCell;
      const middleY = y + halfCell;

      cells.push({
        x,
        y,
        index,
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
