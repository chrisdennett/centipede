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

// STARTS
const drawStartToLeft = (cell) => <Head cell={cell} angle={0} />;
const drawStartToTop = (cell) => <Head cell={cell} angle={90} />;
const drawStartToRight = (cell) => <Head cell={cell} angle={180} />;
const drawStartToBottom = (cell) => <Head cell={cell} angle={270} />;
// ENDS
const drawLeftToEnd = (cell) => <Tail cell={cell} angle={0} />;
const drawTopToEnd = (cell) => <Tail cell={cell} angle={90} />;
const drawRightToEnd = (cell) => <Tail cell={cell} angle={180} />;
const drawBottomToEnd = (cell) => <Tail cell={cell} angle={270} />;
// STRAIGHTS
const drawLeftToRight = (cell) => <Straight cell={cell} angle={0} />;
const drawTopToBottom = (cell) => <Straight cell={cell} angle={90} />;
const drawRightToLeft = (cell) => <Straight cell={cell} angle={180} />;
const drawBottomToTop = (cell) => <Straight cell={cell} angle={270} />;
// CORNERS - ANTI-CLOCKWISE
const drawBottomToLeft = (cell) => <Corner cell={cell} angle={0} dir={-1} />;
const drawLeftToTop = (cell) => <Corner cell={cell} angle={90} dir={-1} />;
const drawTopToRight = (cell) => <Corner cell={cell} angle={180} dir={-1} />;
const drawRightToBottom = (cell) => <Corner cell={cell} angle={270} dir={-1} />;
// CORNER - CLOCKWISE
const drawLeftToBottom = (cell) => <Corner cell={cell} angle={0} dir={1} />;
const drawTopToLeft = (cell) => <Corner cell={cell} angle={90} dir={1} />;
const drawRightToTop = (cell) => <Corner cell={cell} angle={180} dir={1} />;
const drawBottomToRight = (cell) => <Corner cell={cell} angle={270} dir={1} />;

// TAIL
const Tail = ({ cell, angle }) => {
  const { index, middleY, middleX, cellSize } = cell;
  const halfCellSize = cellSize / 2;
  const lineStart = { x: 0, y: halfCellSize };
  const lineEnd = { x: halfCellSize, y: halfCellSize };

  const legDist = 0.165 * 2;
  const legAngle = 0;
  const legDir = 1;

  let p = `M ${lineStart.x},${lineStart.y} `;
  p += ` L ${lineEnd.x},${lineEnd.y} `;

  const leg1Base = getPointOnStraight({
    dist: legDist,
    start: lineStart,
    end: lineEnd,
  });

  return (
    <g
      key={index}
      transform={`translate(${middleX} ${middleY}) rotate(${angle}) translate(${-halfCellSize} ${-halfCellSize})`}
    >
      <g>
        <path d={p} />
        <TailShape pos={lineEnd} cellSize={cellSize} />
        <LegPair
          x={leg1Base.x}
          y={leg1Base.y}
          angle={legAngle}
          legDir={legDir}
        />
      </g>
    </g>
  );
};
const TailShape = ({ pos, cellSize }) => {
  const tailWidth = cellSize / 1.5;
  const tailHeight = cellSize / 2;
  const pt1 = { x: tailWidth, y: tailHeight / 2 };
  const pt2 = { x: 0, y: 0 };
  const pt3 = { x: 0, y: tailHeight };
  const cptOffset = tailHeight / 4;

  const cpt1a = { x: tailWidth, y: cptOffset };
  const cpt2a = { x: 0 + cptOffset, y: 0 };
  const cpt2b = { x: 0 - cptOffset, y: 0 };
  const cpt3a = { x: 0 - cptOffset, y: tailHeight };
  const cpt3b = { x: 0 + cptOffset, y: tailHeight };
  const cpt1b = { x: tailWidth, y: cptOffset + tailHeight / 2 };

  let path = "";
  path += `M ${pt1.x},${pt1.y} `;
  path += `C ${cpt1a.x},${cpt1a.y} `;
  path += `  ${cpt2a.x},${cpt2a.y} `;
  path += `  ${pt2.x},${pt2.y} `;
  path += `C ${cpt2b.x},${cpt2a.y} `;
  path += `  ${cpt3a.x},${cpt3a.y} `;
  path += `  ${pt3.x},${pt3.y} `;
  path += `C ${cpt3b.x},${cpt3b.y} `;
  path += `  ${cpt1b.x},${cpt1b.y} `;
  path += `  ${pt1.x},${pt1.y} `;

  return (
    <g transform={`translate(${pos.x} ${pos.y})`}>
      <circle cx={0} cy={0} r={6} />
      <circle cx={0} cy={0} r={2} />
      <g transform={`translate(${-tailWidth / 4} ${-tailHeight / 2})`}>
        <path d={path} stroke={"black"} fill={"none"} />
      </g>
    </g>
  );
};

// HEAD
const Head = ({ cell, angle }) => {
  const { index, middleY, middleX, cellSize } = cell;
  const halfCellSize = cellSize / 2;
  const lineStart = { x: 0, y: halfCellSize };
  const lineEnd = { x: halfCellSize, y: halfCellSize };

  const legDist = 0.165 * 2;
  const legAngle = 0;
  const legDir = -1;

  let p = `M ${lineStart.x},${lineStart.y} `;
  p += ` L ${lineEnd.x},${lineEnd.y} `;

  const leg1Base = getPointOnStraight({
    dist: legDist,
    start: lineStart,
    end: lineEnd,
  });

  return (
    <g
      key={index}
      transform={`translate(${middleX} ${middleY}) rotate(${angle}) translate(${-halfCellSize} ${-halfCellSize})`}
    >
      <g>
        <path d={p} />
        <HeadShape pos={lineEnd} headWidth={20} headHeight={25} />
        <LegPair
          x={leg1Base.x}
          y={leg1Base.y}
          angle={legAngle}
          legDir={legDir}
        />
      </g>
    </g>
  );
};
const HeadShape = ({ pos, headWidth, headHeight }) => {
  const pt1 = { x: headWidth, y: headHeight / 2 };
  const pt2 = { x: 0, y: 0 };
  const pt3 = { x: 0, y: headHeight };
  const cptOffset = headHeight / 4;

  const cpt1a = { x: headWidth, y: cptOffset };
  const cpt2a = { x: 0 + cptOffset, y: 0 };
  const cpt2b = { x: 0 - cptOffset, y: 0 };
  const cpt3a = { x: 0 - cptOffset, y: headHeight };
  const cpt3b = { x: 0 + cptOffset, y: headHeight };
  const cpt1b = { x: headWidth, y: cptOffset + headHeight / 2 };

  let path = "";
  path += `M ${pt1.x},${pt1.y} `;
  path += `C ${cpt1a.x},${cpt1a.y} `;
  path += `  ${cpt2a.x},${cpt2a.y} `;
  path += `  ${pt2.x},${pt2.y} `;
  path += `C ${cpt2b.x},${cpt2a.y} `;
  path += `  ${cpt3a.x},${cpt3a.y} `;
  path += `  ${pt3.x},${pt3.y} `;
  path += `C ${cpt3b.x},${cpt3b.y} `;
  path += `  ${cpt1b.x},${cpt1b.y} `;
  path += `  ${pt1.x},${pt1.y} `;

  return (
    <g transform={`translate(${pos.x} ${pos.y})`}>
      <circle cx={0} cy={0} r={6} />
      <circle cx={0} cy={0} r={2} />
      <g transform={`translate(${-headWidth / 4} ${-headHeight / 2})`}>
        <path d={path} stroke={"black"} fill={"none"} />
      </g>
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

// CORNER
const Corner = ({ cell, angle, dir = 1 }) => {
  const { cellSize, index, middleX, middleY } = cell;

  const halfCellSize = cellSize / 2;
  const thirdCellSize = cellSize / 3;
  const twoThirdsCellSize = thirdCellSize * 2;

  const start = { x: 0, y: halfCellSize };
  const cpt1 = { x: thirdCellSize, y: halfCellSize };
  const cpt2 = { x: halfCellSize, y: twoThirdsCellSize };
  const end = { x: halfCellSize, y: cellSize };
  const angles = [15, 45, 60];

  const showLegs = true;
  const legDir = dir;

  let quad = `M ${start.x},${start.y} `;
  quad += `C ${cpt1.x},${cpt1.y} `;
  quad += ` ${cpt2.x},${cpt2.y} `;
  quad += ` ${end.x},${end.y} `;

  const leg1Base = getPointOnCurve({ dist: 0.165, start, end, cpt1, cpt2 });
  const leg2Base = getPointOnCurve({ dist: 0.5, start, end, cpt1, cpt2 });
  const leg3Base = getPointOnCurve({ dist: 0.835, start, end, cpt1, cpt2 });

  return (
    <g
      key={index}
      transform={`translate(${middleX} ${middleY}) rotate(${angle}) translate(${-halfCellSize} ${-halfCellSize})`}
    >
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

// STRAIGHT
const Straight = ({ cell, angle }) => {
  const { cellSize, index, middleX, middleY } = cell;
  const halfCellSize = cellSize / 2;
  const start = { x: 0, y: halfCellSize };
  const end = { x: cellSize, y: halfCellSize };

  let p = `M ${start.x},${start.y} `;
  p += ` L ${end.x},${end.y} `;

  const leg1Base = getPointOnStraight({ dist: 0.165, start, end });
  const leg2Base = getPointOnStraight({ dist: 0.5, start, end });
  const leg3Base = getPointOnStraight({ dist: 0.835, start, end });
  const angles = [0, 0, 0];
  const legDir = 1;
  const showLegs = true;

  return (
    <g
      key={index}
      transform={`translate(${middleX} ${middleY}) rotate(${angle}) translate(${-halfCellSize} ${-halfCellSize})`}
    >
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
