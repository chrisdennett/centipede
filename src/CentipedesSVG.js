import React from "react";

export const CentipedesSVG = ({
  svgWidth,
  svgHeight,
  cells,
  cellSize,
  showGrid,
  centipedes,
}) => {
  return (
    <svg
      id="svg"
      xmlns="http://www.w3.org/2000/svg"
      width={svgWidth}
      height={svgHeight}
      fill={"none"}
      stroke={"red"}
      strokeWidth={2}
    >
      {showGrid &&
        cells.map((cell, index) => (
          <rect
            key={"grid" + index}
            x={cell.x}
            y={cell.y}
            width={cellSize}
            height={cellSize}
            stroke={"#ccc"}
          />
        ))}

      {centipedes}
    </svg>
  );
};
