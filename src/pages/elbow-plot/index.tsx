import axios from "axios";
import { GetStaticProps } from "next";
import * as d3 from "d3";
import { COLORS, FONT_SIZE, SERVER } from "@/constants";
import { Box, Center, Heading } from "@chakra-ui/react";
import { AxisLeft } from "../../components/AxisLeft";
import { AxisBottom } from "../../components/AxisBottom";

const width = 800;
const height = 550;
const MARGIN = { top: 30, right: 50, bottom: 60, left: 50 };

const boundsWidth = width - MARGIN.right - MARGIN.left;
const boundsHeight = height - MARGIN.top - MARGIN.bottom;

export default function ElbowPlot({
    sse_vs_clusters,
}: {
    sse_vs_clusters: Object[];
}) {
    const len = sse_vs_clusters.length;
    const yMax = d3.max(sse_vs_clusters);
    const yScale = d3
        .scaleLinear()
        .domain([0, yMax + 1000])
        .range([boundsHeight, 0]);
    const xScale = d3
        .scaleLinear()
        .domain([0, sse_vs_clusters.length + 1])
        .range([0, boundsWidth]);

    const lineGenerator = d3
        .line(sse_vs_clusters)
        .x((d, i) => xScale(i + 1))
        .y((d) => yScale(d));

    const lineData = lineGenerator(sse_vs_clusters);

    const pointsData = sse_vs_clusters.map((d, i) => {
        return (
            <circle
                key={i}
                cx={xScale(i + 1)}
                cy={yScale(d)}
                r={4}
                fill={COLORS.LINE_COLOR}
            />
        );
    });

    // console.log(sse_vs_clusters);

    const slope = (sse_vs_clusters[len - 1] - sse_vs_clusters[0]) / (len - 1);
    const intercept = sse_vs_clusters[0] - slope;
    // console.log(slope, intercept);

    const perpendicularLines = sse_vs_clusters.map((d, i) => {
        const x2 =
            (i + 1 - slope * intercept + slope * d) / (Math.pow(slope, 2) + 1);
        const y2 = slope * x2 + intercept;
        // console.log(x2, y2);
        return (
            <line
                key={i}
                x1={xScale(i + 1)}
                y1={yScale(d)}
                x2={xScale(x2)}
                y2={yScale(y2)}
                stroke={COLORS.LINE_COLOR}
                strokeWidth={2}
                opacity={0.2}
            />
        );
    });

    const bars = sse_vs_clusters.map((d, i) => {
        const barWidth = xScale(2) - xScale(1);
        return (
            <g key={i} shapeRendering={"crispEdges"}>
                <rect
                    x={xScale(i + 1)}
                    y={yScale(d)}
                    height={boundsHeight - yScale(d)}
                    width={barWidth - 5}
                    stroke={COLORS.BORDER_COLOR}
                    fill={COLORS.CLUSTER_BARS}
                    fillOpacity={i == 2 ? 1 : 0.4}
                    strokeWidth={1}
                    rx={1}
                />
                <text
                    x={xScale(i + 1) + barWidth / 2 + 25}
                    y={yScale(d) - 20}
                    textAnchor="end"
                    stroke={COLORS.CLUSTER_BARS}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                    opacity={i == 2 ? 1 : 0.5}
                >
                    {d.toFixed(2)}
                </text>
            </g>
        );
    });

    return (
        <Box>
            <Center>
                <Heading size={"md"}>Elbow Plot</Heading>
            </Center>
            <svg
                style={{ margin: "auto", marginTop: "20px" }}
                width={width}
                height={height}
            >
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left + 20, MARGIN.top].join(
                        ","
                    )})`}
                    shapeRendering={"crispEdges"}
                >
                    <AxisLeft
                        yScale={yScale}
                        pixelsPerTick={60}
                        width={boundsWidth}
                    />
                    <g
                        transform={`translate(0, ${boundsHeight})`}
                        shapeRendering={"crispEdges"}
                    >
                        <AxisBottom
                            xScale={xScale}
                            pixelsPerTick={50}
                            height={boundsHeight}
                        />
                    </g>
                    <g
                        width={boundsWidth}
                        height={boundsHeight}
                        transform={`translate(-${MARGIN.left / 1.7})`}
                        shapeRendering={"crispEdges"}
                    >
                        {bars}
                    </g>
                </g>
                <text
                    x={width / 1.8}
                    y={boundsHeight + 65}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                >
                    Number of Clusters
                </text>
                <text
                    x={-height / 2 + 40}
                    y={MARGIN.left - 40}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                    transform="rotate(-90)"
                >
                    Sum Squared Error
                </text>
            </svg>
            <svg
                style={{ margin: "auto", marginTop: "20px" }}
                width={width}
                height={height}
            >
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left + 20, MARGIN.top].join(
                        ","
                    )})`}
                    shapeRendering={"crispEdges"}
                >
                    <AxisLeft
                        yScale={yScale}
                        pixelsPerTick={60}
                        width={boundsWidth}
                    />
                    <g
                        transform={`translate(0, ${boundsHeight})`}
                        shapeRendering={"crispEdges"}
                    >
                        <AxisBottom
                            xScale={xScale}
                            pixelsPerTick={50}
                            height={boundsHeight}
                        />
                    </g>
                    <path
                        fill="None"
                        stroke={COLORS.LINE_COLOR}
                        strokeWidth={2}
                        d={lineData}
                        shapeRendering={"crispEdges"}
                    />
                    {pointsData}
                    <line
                        x1={xScale(1)}
                        y1={yScale(sse_vs_clusters[0])}
                        x2={xScale(sse_vs_clusters.length)}
                        y2={yScale(sse_vs_clusters[sse_vs_clusters.length - 1])}
                        fill="None"
                        stroke={COLORS.LINE_COLOR_SECONDARY}
                        strokeWidth={2}
                        shapeRendering={"crispEdges"}
                    />
                    {perpendicularLines}
                </g>
                <text
                    x={width / 1.8}
                    y={boundsHeight + 65}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                >
                    Number of Clusters
                </text>
                <text
                    x={-height / 2 + 40}
                    y={MARGIN.left - 40}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                    transform="rotate(-90)"
                >
                    Sum Squared Error
                </text>
            </svg>
        </Box>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const { sse_vs_clusters } = await (
        await axios.get(`${SERVER.hostname}:${SERVER.port}/get_elbow_plot_data`)
    ).data;
    return {
        props: {
            sse_vs_clusters: sse_vs_clusters,
        },
    };
};
