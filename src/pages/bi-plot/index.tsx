import axios from 'axios';
import { GetStaticProps } from 'next';
import * as d3 from 'd3';
import { COLORS, FONT_SIZE, SERVER } from '@/constants';
import { Box, Center, Heading } from '@chakra-ui/react';
import { AxisLeft } from '../../components/AxisLeft';
import { AxisBottom } from '../../components/AxisBottom';

const width = 1000;
const height = 550;
const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const boundsWidth = width - MARGIN.right - MARGIN.left;
const boundsHeight = height - MARGIN.top - MARGIN.bottom;

export default function BiPlot({ bi_plot_points, bi_plot_pca_sorted }: { bi_plot_points: Number[], bi_plot_pca_components: Number[], bi_plot_columns: String[] }) {

    const xMin = d3.min(bi_plot_points, (d: Number[]) => d[0]);
    const xMax = d3.max(bi_plot_points, (d: Number[]) => d[0]);

    const yMin = d3.min(bi_plot_points, (d: Number[]) => d[1]);
    const yMax = d3.max(bi_plot_points, (d: Number[]) => d[1]);

    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([boundsHeight, 0]);
    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, boundsWidth]);
    const allShapes = bi_plot_points.map((d, i) => {
        return (
            <circle
                key={i}
                r={3}
                cx={xScale(d[0])}
                cy={yScale(d[1])}
                opacity={1}
                fill={COLORS.POINT_COLOR}
                fillOpacity={1}
                strokeWidth={1}
                shapeRendering={"crispEdges"}
            />
        );
    });

    const eigenLines = bi_plot_pca_sorted.map((d, i) => {
        return (
            <g key={i}>
                <line
                    key={i}
                    x1={xScale(0)}
                    y1={yScale(0)}
                    x2={xScale(d['pc1_val'] * xRange / 3)}
                    y2={yScale(d['pc2_val'] * yRange / 3)}
                    stroke={COLORS.LINE_COLOR}
                    strokeWidth={2}
                    shapeRendering={"crispEdges"}
                />
                <text
                    x={xScale(d['pc1_val'] * xRange / 3)}
                    y={yScale(d['pc2_val'] * yRange / 3)}
                    fill={COLORS.LINE_COLOR}
                    stroke={COLORS.LINE_COLOR}
                >
                    {d['attr_name']}
                </text>
            </g>
        );
    });

    return (
        <Box>
            <Center>
                <Heading size={"md"}>Bi Plot</Heading>
            </Center>
            <svg style={{ margin: "auto", marginTop: "20px" }} width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                    shapeRendering={"crispEdges"}
                >
                    <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

                    <g transform={`translate(0, ${boundsHeight})`} shapeRendering={"crispEdges"}>
                        <AxisBottom
                            xScale={xScale}
                            pixelsPerTick={40}
                            height={boundsHeight}
                        />
                    </g>
                    {allShapes}
                    {eigenLines}
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
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const { bi_plot_points, bi_plot_pca_sorted } = await (await axios.get(`${SERVER.hostname}:${SERVER.port}/get_bi_plot_data`)).data;
    return {
        props: {
            bi_plot_points: bi_plot_points,
            bi_plot_pca_sorted: bi_plot_pca_sorted,
        }
    }
}
