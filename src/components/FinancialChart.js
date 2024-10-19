import React, { useRef, useState, useEffect } from "react";
import { LinePath, Bar } from "@visx/shape";
import { scaleTime, scaleLinear, scaleBand } from "@visx/scale";
import { extent, max } from "d3-array";
import { timeFormat } from "d3-time-format";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridColumns } from "@visx/grid";
import { localPoint } from "@visx/event";
import * as d3 from "d3";
import "./Chart.css";
import { Button } from "@mui/material";
import Fullscreen from "@mui/icons-material/Fullscreen";
import Compare from "@mui/icons-material/Compare";

const fullData = [
  { date: new Date("2024-10-10"), value: 30000 },
  { date: new Date("2024-10-11"), value: 63000 },
  { date: new Date("2024-10-12"), value: 40000 },
  { date: new Date("2024-10-13"), value: 54000 },
  { date: new Date("2024-10-14"), value: 61000 },
  { date: new Date("2024-10-15"), value: 64500 },
  { date: new Date("2024-10-16"), value: 63179 },
];

const width = 839;
const height = 343;
const margin = { top: 40, right: 30, bottom: 50, left: 50 };

const xAccessor = (d) => d.date;
const yAccessor = (d) => d.value;

const dateFormatter = timeFormat("%b %d");

const ControlPanel = ({ onRangeChange, toggleFullscreen }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "10px 0 18px 40px",
        width: "750px",
        height: "23px",
        lineHeight: "22.77px",
        fontWeight: "400",
      }}
    >
      <div className="action-bar">
        <Button onClick={toggleFullscreen} startIcon={<Fullscreen />}>
          Fullscreen
        </Button>
        <Button startIcon={<Compare />}>Compare</Button>
      </div>
      <div className="action-bar">
        <Button onClick={() => onRangeChange(1)}>1d</Button>
        <Button onClick={() => onRangeChange(3)}>3d</Button>
        <Button onClick={() => onRangeChange(7)}>1w</Button>
        <Button onClick={() => onRangeChange(30)}>1m</Button>
        <Button onClick={() => onRangeChange(180)}>6m</Button>
        <Button onClick={() => onRangeChange(365)}>1y</Button>
      </div>
    </div>
  );
};

const FinancialChart = () => {
  const svgRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipTop, setTooltipTop] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [data, setData] = useState(fullData);
  const [dateRange, setDateRange] = useState(30);

  const filterData = (days) => {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days);
    const filteredData = fullData.filter((d) => d.date >= startDate);
    setData(filteredData);
    setDateRange(days);
  };

  useEffect(() => {
    filterData(dateRange);
  }, []);

  const xScale = scaleTime({
    domain: extent(data, xAccessor),
    range: [margin.left, width - margin.right],
  });

  const yScale = scaleLinear({
    domain: [0, max(data, yAccessor)],
    range: [height - margin.bottom, margin.top],
  });

  const yBarScale = scaleLinear({
    domain: [0, max(data, yAccessor)],
    range: [height - margin.bottom, height - margin.bottom - 40],
  });

  const xBarScale = scaleBand({
    domain: data.map(xAccessor),
    range: [margin.left, width - margin.right],
    padding: 0.1,
  });

  const handleMouseMove = (event) => {
    const { x, y } = localPoint(event) || { x: 0, y: 0 };
    const xDate = xScale.invert(x);

    const closestIndex = d3.bisector(xAccessor).left(data, xDate, 1);

    const d0 = data[closestIndex - 1];
    const d1 = data[closestIndex];

    if (d0 && d1) {
      const closestData =
        xDate - xAccessor(d0) > xAccessor(d1) - xDate ? d1 : d0;

      const yPos = yScale(yAccessor(closestData));

      setTooltipData(closestData);
      setTooltipTop(yPos);
      setTooltipOpen(true);
    } else if (d0) {
      const yPos = yScale(yAccessor(d0));

      setTooltipData(d0);
      setTooltipTop(yPos);
      setTooltipOpen(true);
    } else if (d1) {
      const yPos = yScale(yAccessor(d1));

      setTooltipData(d1);
      setTooltipTop(yPos);
      setTooltipOpen(true);
    } else {
      setTooltipOpen(false);
    }
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  const handleFullscreen = () => {
    if (svgRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        svgRef.current.requestFullscreen();
      }
    }
  };

  const tooltipHeight = -40;

  return (
    <div style={{ position: "relative" }}>
      <ControlPanel
        onRangeChange={filterData}
        toggleFullscreen={handleFullscreen}
      />

      <svg
        ref={svgRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <rect width={width} height={height} fill="transparent" rx={14} />

        <Group>
          <GridColumns
            scale={xScale}
            top={margin.top}
            height={height - margin.top - margin.bottom}
            stroke="#e0e0e0"
            numTicks={5}
          />

          <LinePath
            data={data}
            x={(d) => xScale(xAccessor(d))}
            y={(d) => yScale(yAccessor(d))}
            stroke="#4B40EE"
            strokeWidth={2}
          />

          {data.map((d) => (
            <Bar
              key={xAccessor(d).toString()}
              x={xBarScale(xAccessor(d))}
              y={yBarScale(yAccessor(d))}
              height={yBarScale(0) - yBarScale(yAccessor(d))}
              width={xBarScale.bandwidth()}
              fill="#E6E8EB"
            />
          ))}

          <AxisBottom
            scale={xScale}
            top={height - margin.bottom}
            tickFormat={dateFormatter}
            stroke="#E8E7FF"
            numTicks={0}
            tickLabelProps={() => ({
              display: "none",
            })}
          />

          <AxisLeft
            scale={yScale}
            left={margin.left}
            height={height - margin.top - margin.bottom}
            stroke="#E8E7FF"
            hideTicks="true"
            hideZero="true"
            tickComponent={() => {}}
          />
        </Group>

        {tooltipOpen && (
          <>
            <line
              x1={xScale(xAccessor(tooltipData))}
              x2={xScale(xAccessor(tooltipData))}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke="gray"
              strokeDasharray="4,4"
            />

            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={tooltipTop}
              y2={tooltipTop}
              stroke="gray"
              strokeDasharray="4,4"
            />
          </>
        )}
      </svg>

      {tooltipOpen && (
        <div
          style={{
            position: "absolute",
            left: "790px",
            top: `${tooltipTop - tooltipHeight / 2}px`,
            backgroundColor: "#1A243A",
            width: "auto",
            height: "23px",
            padding: "5px 14px",
            color: "#FFFFFF",
            fontFamily: "Circular Std",
            borderRadius: "5px",
            lineHeight: "22.77px",
            fontSize: "18px",
            fontWeight: "400",
          }}
        >
          <div>
            <strong>{`${tooltipData.value.toLocaleString()}`}</strong>
          </div>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: "790px",
          top: `${
            yScale(yAccessor(data[data.length - 1])) - tooltipHeight / 2
          }px`,
          backgroundColor: "#4B40EE",
          width: "auto",
          height: "23px",
          padding: "5px 14px",
          color: "#FFFFFF",
          fontFamily: "Circular Std",
          borderRadius: "5px",
          lineHeight: "22.77px",
          fontSize: "18px",
          fontWeight: "400",
        }}
      >
        <div>
          <strong>{`${data[data.length - 1].value.toLocaleString()}`}</strong>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
