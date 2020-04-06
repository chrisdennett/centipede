import React from "react";

const Centipede = ({ cells, inTestMode = true }) => {
  const segments = inTestMode
    ? createTestSegments(cells)
    : createSegments(cells);

  return <>{segments}</>;
};

export default Centipede;

const createTestSegments = (cells) => {
  let cellParts = [];
  cellParts.push(drawSegment({ cell: cells[0], from: "start", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[1], from: "left", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[2], from: "left", to: "bottom" }));
  cellParts.push(drawSegment({ cell: cells[12], from: "top", to: "left" }));
  cellParts.push(drawSegment({ cell: cells[11], from: "right", to: "bottom" }));
  cellParts.push(drawSegment({ cell: cells[21], from: "top", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[22], from: "left", to: "bottom" }));
  cellParts.push(drawSegment({ cell: cells[32], from: "top", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[33], from: "left", to: "top" }));
  cellParts.push(drawSegment({ cell: cells[23], from: "bottom", to: "top" }));
  cellParts.push(drawSegment({ cell: cells[13], from: "bottom", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[14], from: "left", to: "bottom" }));
  cellParts.push(drawSegment({ cell: cells[24], from: "top", to: "bottom" }));
  cellParts.push(drawSegment({ cell: cells[34], from: "top", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[35], from: "left", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[36], from: "left", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[37], from: "left", to: "right" }));
  cellParts.push(drawSegment({ cell: cells[38], from: "left", to: "top" }));
  cellParts.push(drawSegment({ cell: cells[28], from: "bottom", to: "left" }));
  cellParts.push(drawSegment({ cell: cells[27], from: "right", to: "left" }));
  cellParts.push(drawSegment({ cell: cells[26], from: "right", to: "top" }));
  cellParts.push(drawSegment({ cell: cells[16], from: "bottom", to: "left" }));
  cellParts.push(drawSegment({ cell: cells[15], from: "right", to: "bottom" }));
  cellParts.push(drawSegment({ cell: cells[25], from: "top", to: "end" }));

  return cellParts;
};

const createSegments = (cells) => {
  const paths = [];
  let count = 0;
  let endReached = false;
  const availableCells = cells.filter((cell) => !cell.endedOn);
  let randomIndex = getRandomIntBetween(0, availableCells.length - 1);
  let nextCellIndex = availableCells[randomIndex].index;
  let prevCellEndedOn;

  while (endReached === false && count < 300000) {
    const cell = cells[nextCellIndex];
    const randomNeighBourOption = getAvailableNeighbourOptions(cell, cells);

    if (randomNeighBourOption === null) {
      endReached = true;
    }
    const sideToDrawTo = randomNeighBourOption
      ? randomNeighBourOption[0]
      : null;
    cell.endedOn = sideToDrawTo;
    nextCellIndex = randomNeighBourOption ? randomNeighBourOption[1] : null;

    const sideToDrawFrom = getStartSideFromEndSide(prevCellEndedOn);
    const segment = drawSegment({
      cell,
      from: sideToDrawFrom ? sideToDrawFrom : "start",
      to: sideToDrawTo ? sideToDrawTo : "end",
    });

    paths.push(segment);
    prevCellEndedOn = sideToDrawTo;
    count++;
  }

  return paths;
};

const getStartSideFromEndSide = (endSide) => {
  if (endSide === "bottom") return "top";
  if (endSide === "top") return "bottom";
  if (endSide === "right") return "left";
  if (endSide === "left") return "right";
};

const getAvailableNeighbourOptions = (cell, cells) => {
  const { indexAbove, indexBelow, indexLeft, indexRight } = cell;

  const possOptions = [];

  if (indexAbove >= 0 && !cells[indexAbove].endedOn) {
    possOptions.push(["top", indexAbove]);
  }

  if (indexBelow >= 0 && !cells[indexBelow].endedOn) {
    possOptions.push(["bottom", indexBelow]);
  }

  if (indexLeft >= 0 && !cells[indexLeft].endedOn) {
    possOptions.push(["left", indexLeft]);
  }

  if (indexRight >= 0 && !cells[indexRight].endedOn) {
    possOptions.push(["right", indexRight]);
  }

  if (possOptions.length === 0) return null;

  // get random option from those available
  const randIndex = getRandomIntBetween(0, possOptions.length - 1);
  const randOption = possOptions[randIndex];

  return randOption;
};

// DRAW SEGMENT
const drawSegment = ({ cell, from, to }) => {
  let s = null;
  if (from === "start") {
    if (to === "right") s = drawStartToRight(cell);
    if (to === "bottom") s = drawStartToBottom(cell);
    if (to === "left") s = drawStartToLeft(cell);
    if (to === "top") s = drawStartToTop(cell);
  }
  if (to === "end") {
    if (from === "top") s = drawTopToEnd(cell);
    if (from === "left") s = drawLeftToEnd(cell);
    if (from === "right") s = drawRightToEnd(cell);
    if (from === "bottom") s = drawBottomToEnd(cell);
  }
  if (from === "left") {
    if (to === "right") s = drawLeftToRight(cell);
    if (to === "bottom") s = drawLeftToBottom(cell);
    if (to === "top") s = drawLeftToTop(cell);
  }
  if (from === "top") {
    if (to === "right") s = drawTopToRight(cell);
    if (to === "bottom") s = drawTopToBottom(cell);
    if (to === "left") s = drawTopToLeft(cell);
  }
  if (from === "bottom") {
    if (to === "right") s = drawBottomToRight(cell);
    if (to === "top") s = drawBottomToTop(cell);
    if (to === "left") s = drawBottomToLeft(cell);
  }
  if (from === "right") {
    if (to === "bottom") s = drawRightToBottom(cell);
    if (to === "top") s = drawRightToTop(cell);
    if (to === "left") s = drawRightToLeft(cell);
  }
  return s;
};

// From LEFT
const drawLeftToRight = (cell) => {
  const { index, middleY, rightX, x } = cell;
  const start = { x: x, y: middleY };
  const end = { x: rightX, y: middleY };

  return getStraightSegment({ start, end, key: index, angles: [0, 0, 0] });
};
const drawLeftToBottom = (cell) => {
  const { x, middleY, middleX, bottomY, thirdX, twoThirdY } = cell;

  const start = { x: x, y: middleY };
  const cpt1 = { x: thirdX, y: middleY };
  const cpt2 = { x: middleX, y: twoThirdY };
  const end = { x: middleX, y: bottomY };
  const angles = [15, 45, 60];

  return getCornerSegment({ start, cpt1, cpt2, end, angles, key: cell.index });
};
const drawLeftToTop = (cell) => {
  const { x, y, middleY, middleX, thirdX, thirdY } = cell;

  const start = { x: x, y: middleY };
  const cpt1 = { x: thirdX, y: middleY };
  const cpt2 = { x: middleX, y: thirdY };
  const end = { x: middleX, y: y };
  const angles = [90 + 60, 90 + 45, 90 + 15];

  return getCornerSegment({
    start,
    cpt1,
    cpt2,
    end,
    angles,
    key: cell.index,
    legDir: -1,
  });
};

// FROM TOP
const drawTopToBottom = (cell) => {
  const { index, y, middleX, bottomY } = cell;
  const start = { x: middleX, y: y };
  const end = { x: middleX, y: bottomY };

  return getStraightSegment({ start, end, key: index, angles: [90, 90, 90] });
};
const drawTopToLeft = (cell) => {
  const { x, y, middleY, middleX, thirdX, thirdY } = cell;

  const start = { x: middleX, y: y };
  const cpt1 = { x: middleX, y: thirdY };
  const cpt2 = { x: thirdX, y: middleY };
  const end = { x: x, y: middleY };
  const angles = [90 + 15, 90 + 45, 90 + 60];

  return getCornerSegment({
    start,
    cpt1,
    cpt2,
    end,
    angles,
    key: cell.index,
  });
};
const drawTopToRight = (cell) => {
  const { y, middleY, middleX, twoThirdX, thirdY, rightX } = cell;

  const start = { x: middleX, y: y };
  const cpt1 = { x: middleX, y: thirdY };
  const cpt2 = { x: twoThirdX, y: middleY };
  const end = { x: rightX, y: middleY };
  const angles = [180 + 60, 180 + 45, 180 + 15];

  return getCornerSegment({
    start,
    cpt1,
    cpt2,
    end,
    angles,
    key: cell.index,
    legDir: -1,
  });
};

// FROM RIGHT
const drawRightToBottom = (cell) => {
  const { bottomY, middleY, middleX, twoThirdY, twoThirdX, rightX } = cell;

  const start = { x: rightX, y: middleY };
  const cpt1 = { x: twoThirdX, y: middleY };
  const cpt2 = { x: middleX, y: twoThirdY };
  const end = { x: middleX, y: bottomY };
  const angles = [270 + 60, 270 + 45, 270 + 15];

  return getCornerSegment({
    start,
    cpt1,
    cpt2,
    end,
    angles,
    key: cell.index,
    legDir: -1,
  });
};
const drawRightToLeft = (cell) => {
  const { index, middleY, rightX, x } = cell;
  const start = { x: rightX, y: middleY };
  const end = { x: x, y: middleY };

  return getStraightSegment({
    start,
    end,
    key: index,
    angles: [0, 0, 0],
    legDir: -1,
  });
};
const drawRightToTop = (cell) => {
  const { y, middleY, middleX, thirdY, twoThirdX, rightX } = cell;

  const start = { x: rightX, y: middleY };
  const cpt1 = { x: twoThirdX, y: middleY };
  const cpt2 = { x: middleX, y: thirdY };
  const end = { x: middleX, y: y };
  const angles = [180 + 15, 180 + 45, 180 + 60];

  return getCornerSegment({
    start,
    cpt1,
    cpt2,
    end,
    angles,
    key: cell.index,
  });
};

// FROM BOTTOM
const drawBottomToRight = (cell) => {
  const { bottomY, middleY, middleX, twoThirdY, twoThirdX, rightX } = cell;

  const start = { x: middleX, y: bottomY };
  const cpt1 = { x: middleX, y: twoThirdY };
  const cpt2 = { x: twoThirdX, y: middleY };
  const end = { x: rightX, y: middleY };
  const angles = [270 + 15, 270 + 45, 270 + 60];

  return getCornerSegment({
    start,
    cpt1,
    cpt2,
    end,
    angles,
    key: cell.index,
  });
};
const drawBottomToLeft = (cell) => {
  const { x, middleY, middleX, bottomY, thirdX, twoThirdY } = cell;

  const start = { x: middleX, y: bottomY };
  const cpt1 = { x: middleX, y: twoThirdY };
  const cpt2 = { x: thirdX, y: middleY };
  const end = { x: x, y: middleY };
  const angles = [60, 45, 15];

  return getCornerSegment({
    start,
    cpt1,
    cpt2,
    end,
    angles,
    key: cell.index,
    legDir: -1,
  });
};
const drawBottomToTop = (cell) => {
  const { index, y, middleX, bottomY } = cell;
  const start = { x: middleX, y: bottomY };
  const end = { x: middleX, y: y };

  return getStraightSegment({
    start,
    end,
    key: index,
    angles: [90, 90, 90],
    legDir: -1,
  });
};

// STARTS
const drawStartToRight = (cell) => {
  let p = `M ${cell.middleMiddle} `;
  p += ` L ${cell.rightMiddle} `;

  const { middleX, middleY, rightX } = cell;
  const start = { x: middleX, y: middleY };
  const end = { x: rightX, y: middleY };
  const leg1Base = getPointOnStraight({ dist: 0.165 + 0.5, start, end });

  return (
    <g key={cell.index}>
      <path d={p} />
      <circle cx={cell.middleX} cy={cell.middleY} r={10} />
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />
      <LegPair x={leg1Base.x} y={leg1Base.y} angle={0} />
    </g>
  );
};
const drawStartToLeft = (cell) => {
  let p = `M ${cell.middleMiddle} `;
  p += ` L ${cell.leftMiddle} `;

  const { middleX, middleY, x } = cell;
  const start = { x: middleX, y: middleY };
  const end = { x: x, y: middleY };
  const leg1Base = getPointOnStraight({ dist: 0.165 * 2, start, end });

  return (
    <g key={cell.index}>
      <path d={p} />
      <circle cx={cell.middleX} cy={cell.middleY} r={10} />
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />
      <LegPair x={leg1Base.x} y={leg1Base.y} angle={0} legDir={-1} />
    </g>
  );
};
const drawStartToTop = (cell) => {
  let p = `M ${cell.middleMiddle} `;
  p += ` L ${cell.topMiddle} `;

  const { middleX, middleY, y } = cell;
  const start = { x: middleX, y: middleY };
  const end = { x: middleX, y: y };
  const leg1Base = getPointOnStraight({ dist: 0.165 * 2, start, end });

  return (
    <g key={cell.index}>
      <path d={p} />
      <circle cx={cell.middleX} cy={cell.middleY} r={10} />
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />
      <LegPair x={leg1Base.x} y={leg1Base.y} angle={90} legDir={-1} />
    </g>
  );
};
const drawStartToBottom = (cell) => {
  let p = `M ${cell.middleMiddle} `;
  p += ` L ${cell.bottomMiddle} `;

  const { middleX, middleY, bottomY } = cell;
  const start = { x: middleX, y: middleY };
  const end = { x: middleX, y: bottomY };
  const leg1Base = getPointOnStraight({ dist: 0.165 + 0.5, start, end });

  return (
    <g key={cell.index}>
      <path d={p} />
      <circle cx={cell.middleX} cy={cell.middleY} r={10} />
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />
      <LegPair x={leg1Base.x} y={leg1Base.y} angle={90} />
    </g>
  );
};

// ENDS
const drawTopToEnd = (cell) => {
  const { y, middleX, middleY, topMiddle, middleMiddle } = cell;

  let p = `M ${topMiddle} `;
  p += ` L ${middleMiddle} `;

  const start = { x: middleX, y: y };
  const end = { x: middleX, y: middleY };
  const leg1Base = getPointOnStraight({ dist: 0.165 * 2, start, end });

  return (
    <g key={cell.index}>
      <path d={p} />,
      <circle cx={cell.middleX} cy={cell.middleY} r={5} />,
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />
      <LegPair x={leg1Base.x} y={leg1Base.y} angle={90} />
    </g>
  );
};
const drawLeftToEnd = (cell) => {
  let p = `M ${cell.leftMiddle} `;
  p += ` L ${cell.middleMiddle} `;

  const { middleX, middleY, x } = cell;
  const start = { x: x, y: middleY };
  const end = { x: middleX, y: middleY };
  const leg1Base = getPointOnStraight({ dist: 0.165 * 2, start, end });

  return (
    <g key={cell.index}>
      <path d={p} />,
      <circle cx={cell.middleX} cy={cell.middleY} r={5} />
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />
      <LegPair x={leg1Base.x} y={leg1Base.y} angle={0} />
    </g>
  );
};
const drawRightToEnd = (cell) => {
  let p = `M ${cell.rightMiddle} `;
  p += ` L ${cell.middleMiddle} `;

  const { middleX, middleY, rightX } = cell;
  const start = { x: rightX, y: middleY };
  const end = { x: middleX, y: middleY };
  const leg1Base = getPointOnStraight({ dist: 0.165 + 0.5, start, end });

  return (
    <g key={cell.index}>
      <path d={p} />
      <circle cx={cell.middleX} cy={cell.middleY} r={5} />
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />
      <LegPair x={leg1Base.x} y={leg1Base.y} angle={0} legDir={-1} />
    </g>
  );
};
const drawBottomToEnd = (cell) => {
  let p = `M ${cell.bottomMiddle} `;
  p += ` L ${cell.middleMiddle} `;

  const { middleX, middleY, bottomY } = cell;
  const start = { x: middleX, y: bottomY };
  const end = { x: middleX, y: middleY };
  const leg1Base = getPointOnStraight({ dist: 0.165 + 0.5, start, end });

  return (
    <g key={cell.index}>
      <path d={p} />
      <circle cx={cell.middleX} cy={cell.middleY} r={5} />
      <circle cx={cell.middleX} cy={cell.middleY} r={2} />
      <LegPair x={leg1Base.x} y={leg1Base.y} angle={90} legDir={-1} />
    </g>
  );
};

// LEGS
const LegPair = ({ x, y, angle, legDir = 1 }) => {
  const legLength = 9;
  const tipXOffset = 7;
  const legWithTip = legLength + tipXOffset;
  const tipSize = tipXOffset * legDir;

  const baseThickness = 5;
  const baseLength = 8;
  const letStartOffset = baseLength / 2;

  let quad = `M ${0},${letStartOffset} `;
  quad += `C ${0},${legLength} `;
  quad += ` ${0},${legWithTip} `;
  quad += ` ${tipSize},${legWithTip} `;

  let quad2 = `M ${0},${-letStartOffset} `;
  quad2 += `C ${0},${-legLength} `;
  quad2 += ` ${0},${-legWithTip} `;
  quad2 += ` ${tipSize},${-legWithTip} `;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <rect
        fill={"none"}
        x={-baseThickness / 2}
        y={-baseLength / 2}
        width={baseThickness}
        height={baseLength}
        rx="3"
      />
      {/* <ellipse cx={0} cy={0} rx={baseLength} ry={baseThickness} /> */}

      {/* LEG 1 */}
      <path d={quad} />
      {/* LEG 2 */}
      <path d={quad2} />
    </g>
  );
};

//
// KEY SEGMENT METHODS
//
const getCornerSegment = ({
  start,
  end,
  cpt1,
  cpt2,
  key,
  showLegs = true,
  angles,
  legDir,
}) => {
  let quad = `M ${start.x},${start.y} `;
  quad += `C ${cpt1.x},${cpt1.y} `;
  quad += ` ${cpt2.x},${cpt2.y} `;
  quad += ` ${end.x},${end.y} `;

  const leg1Base = getPointOnCurve({ dist: 0.165, start, end, cpt1, cpt2 });
  const leg2Base = getPointOnCurve({ dist: 0.5, start, end, cpt1, cpt2 });
  const leg3Base = getPointOnCurve({ dist: 0.835, start, end, cpt1, cpt2 });

  return (
    <g key={key}>
      <path d={quad} />

      {showLegs && (
        <>
          <LegPair
            x={leg1Base.x}
            y={leg1Base.y}
            angle={angles[0]}
            legDir={legDir}
          />
          <LegPair
            x={leg2Base.x}
            y={leg2Base.y}
            angle={angles[1]}
            legDir={legDir}
          />
          <LegPair
            x={leg3Base.x}
            y={leg3Base.y}
            angle={angles[2]}
            legDir={legDir}
          />
        </>
      )}
    </g>
  );
};

const getStraightSegment = ({
  start,
  end,
  key: index,
  showLegs = true,
  angles,
  legDir,
}) => {
  let p = `M ${start.x},${start.y} `;
  p += ` L ${end.x},${end.y} `;

  const leg1Base = getPointOnStraight({ dist: 0.165, start, end });
  const leg2Base = getPointOnStraight({ dist: 0.5, start, end });
  const leg3Base = getPointOnStraight({ dist: 0.835, start, end });

  return (
    <g key={index}>
      <path d={p} />
      {showLegs && (
        <>
          <LegPair
            x={leg1Base.x}
            y={leg1Base.y}
            angle={angles[0]}
            legDir={legDir}
          />
          <LegPair
            x={leg2Base.x}
            y={leg2Base.y}
            angle={angles[1]}
            legDir={legDir}
          />
          <LegPair
            x={leg3Base.x}
            y={leg3Base.y}
            angle={angles[2]}
            legDir={legDir}
          />
        </>
      )}
    </g>
  );
};

//
// HELPERS
//
const getPointOnStraight = ({ dist, start, end }) => {
  const diffX = Math.abs(end.x - start.x);
  const diffY = Math.abs(end.y - start.y);

  const lowestX = Math.min(start.x, end.x);
  const lowestY = Math.min(start.y, end.y);

  return {
    x: lowestX + diffX * dist,
    y: lowestY + diffY * dist,
  };
};

const getPointOnCurve = ({ dist = 0.5, start, end, cpt1, cpt2 }) => {
  const p0 = lerp(start, cpt1, dist);
  const p1 = lerp(cpt1, cpt2, dist);
  const p2 = lerp(cpt2, end, dist);
  const p3 = lerp(p0, p1, dist);
  const p4 = lerp(p1, p2, dist);

  return lerp(p3, p4, dist);
};

const lerp = (ptA, ptB, dist) => {
  return {
    x: (ptB.x - ptA.x) * dist + ptA.x, // the x coordinate
    y: (ptB.y - ptA.y) * dist + ptA.y, // the y coordinate
  };
};

const getRandomIntBetween = (min, max) => {
  return Math.round(Math.random() * max);
};
