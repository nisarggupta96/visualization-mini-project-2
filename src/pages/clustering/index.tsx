import axios from "axios";
import { GetStaticProps } from "next";
import * as d3 from "d3";
import { COLORS, FONT_SIZE, SERVER } from "@/constants";
import { Box, Center, Heading } from "@chakra-ui/react";
import { AxisLeft } from "../../components/AxisLeft";
import { AxisBottom } from "../../components/AxisBottom";
import Legend from "@/components/Legend";

const width = 1200;
const height = 600;
const MARGIN = { top: 30, right: 50, bottom: 60, left: 50 };

const boundsWidth = width - MARGIN.right - MARGIN.left;
const boundsHeight = height - MARGIN.top - MARGIN.bottom;

export default function ClusterPlot({
    clustered_data,
}: {
    clustered_data: Object[];
}) {
    const xMin = d3.min(Object.values(clustered_data["Component 1"]));
    const xMax = d3.max(Object.values(clustered_data["Component 1"]));
    const yMin = d3.min(Object.values(clustered_data["Component 2"]));
    const yMax = d3.max(Object.values(clustered_data["Component 2"]));

    const xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([0, boundsWidth]);
    const yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([boundsHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeSet1).domain([0, 1, 2]);

    const pointsData = Object.keys(clustered_data["Component 1"]).map(
        (d, i) => {
            return (
                <circle
                    key={i}
                    cx={xScale(clustered_data["Component 1"][d])}
                    cy={yScale(clustered_data["Component 2"][d])}
                    r={3}
                    fill={colorScale(clustered_data["Segment PCA"][d])}
                    shapeRendering={"crispEdges"}
                />
            );
        }
    );

    return (
        <Box position={"relative"}>
            <Center>
                <Heading size={"md"}>Clustering</Heading>
            </Center>
            <svg
                style={{
                    margin: "auto",
                    marginTop: "20px",
                }}
                width={width}
                height={height}
            >
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(
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
                    {pointsData}
                </g>
                <text
                    x={width / 2}
                    y={boundsHeight + 65}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                >
                    PC1
                </text>
                <text
                    x={-height / 2 + 12}
                    y={MARGIN.left - 40}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                    transform="rotate(-90)"
                >
                    PC2
                </text>
            </svg>
            <Box
                style={{
                    position: "absolute",
                    top: "100px",
                    left: "250px",
                    background: "white",
                }}
            >
                <Legend num_components={3} />
            </Box>
        </Box>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const { clustered_data } = await (
        await axios.get(`${SERVER.hostname}:${SERVER.port}/get_kmeans_pca_data`)
    ).data;
    return {
        props: {
            clustered_data: clustered_data,
        },
    };
};
