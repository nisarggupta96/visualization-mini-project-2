import axios from "axios";
import { GetStaticProps } from "next";
import * as d3 from "d3";
import { COLORS, FONT_SIZE, SERVER } from "@/constants";
import {
    Box,
    Center,
    Heading,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import DIndexContext from "@/context/dindex";

const width = 600;
const height = 500;
const MARGIN = { top: 30, right: 30, bottom: 30, left: 90 };
const BAR_PADDING = 0.2;

const boundsWidth = width - MARGIN.right - MARGIN.left;
const boundsHeight = height - MARGIN.top - MARGIN.bottom;

export default function ScreePlot({
    variance_ratio,
    cumulative_variance_ratio,
}: {
    variance_ratio: Number[];
    cumulative_variance_ratio: Number[];
}) {
    const { currentDimensions, modifyDimensions } = useContext(DIndexContext);

    const axisRef = useRef(null);

    const yScale = d3.scaleLinear().domain([0, 1]).range([boundsHeight, 0]);

    const xScale = d3
        .scaleBand()
        .domain(Array.from({ length: variance_ratio.length }, (_, i) => i + 1))
        .range([1, boundsWidth])
        .padding(BAR_PADDING)
        .round(true);

    const allShapes = variance_ratio.map((d, i) => {
        return (
            <g key={i} shapeRendering={"crispEdges"}>
                <rect
                    x={xScale(i + 1)}
                    y={yScale(d)}
                    height={boundsHeight - yScale(d)}
                    width={xScale.bandwidth()}
                    stroke={COLORS.BORDER_COLOR}
                    fill={COLORS.FILL_COLOR}
                    fillOpacity={i < currentDimensions ? 1 : 0.4}
                    strokeWidth={1}
                    rx={1}
                />
                <text
                    x={xScale(i + 1) + xScale.bandwidth() / 2 + 20}
                    y={yScale(d) - 25}
                    textAnchor="end"
                    stroke={COLORS.BORDER_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                >
                    {d.toFixed(4)}
                </text>
            </g>
        );
    });

    useEffect(() => {
        const svgElement = d3.select(axisRef.current);

        // Add X and Y Axis through d3
        const xAxisGenerator = d3.axisBottom(xScale);

        svgElement
            .append("g")
            .attr(
                "transform",
                `translate(${MARGIN.left}, ${height - MARGIN.bottom})`
            )
            .attr("color", COLORS.BORDER_COLOR)
            .style("font-size", FONT_SIZE.MEDIUM)
            .attr("shape-rendering", "crispEdges")
            .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);

        svgElement
            .append("g")
            .attr("transform", `translate(${MARGIN.left + 1}, ${MARGIN.top})`)
            .attr("color", COLORS.BORDER_COLOR)
            .style("font-size", FONT_SIZE.MEDIUM)
            .attr("shape-rendering", "crispEdges")
            .call(yAxisGenerator);

        // Add the line plot for cumulative variance ratio
        const line = d3
            .line()
            .defined((i: Number) => cumulative_variance_ratio)
            .x((d: Number, i: Number) => xScale(+i + 1))
            .y((d: Number, i: Number) => yScale(d));

        svgElement
            .append("path")
            .attr("fill", "none")
            .attr("stroke", COLORS.LINE_COLOR)
            .attr("stroke-width", 1)
            .attr(
                "transform",
                `translate(${MARGIN.left + xScale.bandwidth() / 2}, ${
                    MARGIN.top
                })`
            )
            .attr("d", line(cumulative_variance_ratio));

        // Add markers for the line points
        svgElement
            .selectAll("myCircles")
            .data(cumulative_variance_ratio)
            .enter()
            .append("circle")
            .attr("fill", "red")
            .attr("stroke", "none")
            .attr("cx", (d: Number, i: Number) => xScale(+i + 1))
            .attr("cy", (d: Number, i: Number) => yScale(d))
            .attr(
                "transform",
                `translate(${MARGIN.left + xScale.bandwidth() / 2}, ${
                    MARGIN.top
                })`
            )
            .attr("r", 3);
    }, [xScale, yScale, cumulative_variance_ratio]);

    return (
        <Box>
            <Center>
                <Heading size={"md"}>Scree Plot</Heading>
            </Center>
            <Center mt={10}>
                Dimensionality index: <b>{currentDimensions}</b>
                <Slider
                    ml={5}
                    w={"500px"}
                    defaultValue={currentDimensions}
                    min={1}
                    max={variance_ratio.length}
                    step={1}
                    onChange={(val) => modifyDimensions(val)}
                >
                    <SliderTrack bg="red.100">
                        <Box position="relative" right={10} />
                        <SliderFilledTrack bg="tomato" />
                    </SliderTrack>
                    <SliderThumb boxSize={5} />
                </Slider>
            </Center>
            <svg
                style={{ margin: "auto", marginTop: "50px" }}
                ref={axisRef}
                width={width + 100}
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
                    {allShapes}
                </g>
                <text
                    x={width + 3 * MARGIN.right}
                    y={height - 1 * MARGIN.bottom}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                >
                    PCA Components
                </text>
                <text
                    x={-height / 3}
                    y={MARGIN.left / 2}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                    transform="rotate(-90)"
                >
                    Explained Co-variance ratio
                </text>
                <text
                    x={width}
                    y={15}
                    textAnchor="end"
                    fill={COLORS.LINE_COLOR}
                    stroke={COLORS.LINE_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                >
                    Cumulative explained co-variance
                </text>
            </svg>
        </Box>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const { variance_ratio, cumulative_variance_ratio } = await (
        await axios.get(`${SERVER.hostname}:${SERVER.port}/get_scree_data`)
    ).data;
    return {
        props: {
            variance_ratio: variance_ratio,
            cumulative_variance_ratio: cumulative_variance_ratio,
        },
    };
};
