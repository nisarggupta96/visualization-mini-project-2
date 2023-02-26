import { COLORS, FONT_SIZE } from "@/constants";
import { Box } from "@chakra-ui/react";
import * as d3 from "d3";
import { AxisBottom } from "./AxisBottom";
import { AxisLeft } from "./AxisLeft";

export const ScatterPlot = ({width, height, margins, xCol, yCol, data, min_max_values, shouldDisplayXColumn, shouldDisplayYColumn}) => {
    const boundsHeight = height - margins*1.2;
    const boundsWidth = width - margins*1.2;

    const {min_val: xMin, max_val: xMax} = min_max_values[xCol];
    const {min_val: yMin, max_val: yMax} = min_max_values[yCol];

    const yScale = d3.scaleLinear().domain([0, yMax]).range([boundsHeight, 0]);
    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, boundsWidth]);

    const allShapes = Object.keys(data[xCol]).map(i => {
        return (
            <circle
                key={i}
                r={2}
                cx={xScale(data[xCol][i])}
                cy={yScale(data[yCol][i])}
                opacity={2}
                fill={COLORS.POINT_COLOR_SM}
                fillOpacity={1}
                strokeWidth={1}
                shapeRendering={"crispEdges"}
            />
        );
    });

    return <Box>
        <svg style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse"}} width={width} height={height} >
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[margins, margins/2].join(",")})`}
                    shapeRendering={"crispEdges"}
                >
                    <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} fontSize={FONT_SIZE.SMALL}/>

                    <g transform={`translate(0, ${boundsHeight})`} shapeRendering={"crispEdges"}>
                        <AxisBottom
                            xScale={xScale}
                            pixelsPerTick={40}
                            height={boundsHeight}
                            xRotate={-30}
                            fontSize={FONT_SIZE.SMALL}
                        />
                    </g>
                    {allShapes}
                </g>
            </svg>
            {shouldDisplayXColumn && (
                <text
                    x={width}
                    y={boundsHeight + 50}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.SMALL}
                >
                    {xCol}
                </text>
            )}
            {shouldDisplayYColumn && (
                <text
                    x={-height / 2 + 24}
                    y={margins - 20}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.SMALL}
                    transform="rotate(-90)"
                >
                    {yCol}
                </text>
            )}
    </Box>
};

