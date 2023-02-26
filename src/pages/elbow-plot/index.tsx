import axios from 'axios';
import { GetStaticProps } from 'next';
import * as d3 from 'd3';
import { COLORS, FONT_SIZE, SERVER } from '@/constants';
import { Box, Center, Heading } from '@chakra-ui/react';
import { AxisLeft } from '../../components/AxisLeft';
import { AxisBottom } from '../../components/AxisBottom';

const width = 800;
const height = 550;
const MARGIN = { top: 30, right: 50, bottom: 60, left: 50 };

const boundsWidth = width - MARGIN.right - MARGIN.left;
const boundsHeight = height - MARGIN.top - MARGIN.bottom;

export default function ElbowPlot({ sse_vs_clusters }: { sse_vs_clusters: Object[] }) {
    
    const yMax = d3.max(sse_vs_clusters);
    const yScale = d3.scaleLinear().domain([0, yMax+1000]).range([boundsHeight, 0]);
    const xScale = d3.scaleLinear().domain([0, sse_vs_clusters.length+1]).range([0, boundsWidth]);
    
    const lineGenerator = d3
        .line(sse_vs_clusters)
        .x((d,i) => xScale(i+1))
        .y(d => yScale(d));
    
    const lineData = lineGenerator(sse_vs_clusters);

    const pointsData = sse_vs_clusters.map((d, i) => {
        return (
            <circle
                key={i}
                cx={xScale(i+1)}
                cy={yScale(d)}
                r={4}
                fill={COLORS.LINE_COLOR} 
            />)
    })

    return (
        <Box>
            <Center>
                <Heading size={"md"}>Elbow Plot</Heading>
            </Center>
            <svg style={{ margin: "auto", marginTop: "20px" }} width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left+20, MARGIN.top].join(",")})`}
                    shapeRendering={"crispEdges"}
                >
                    <AxisLeft yScale={yScale} pixelsPerTick={60} width={boundsWidth} />
                    <g transform={`translate(0, ${boundsHeight})`} shapeRendering={"crispEdges"}>
                        <AxisBottom
                            xScale={xScale}
                            pixelsPerTick={50}
                            height={boundsHeight}
                        />
                    </g>
                    <path
                        fill='None'
                        stroke={COLORS.LINE_COLOR}
                        strokeWidth={2}
                        d={lineData}
                        shapeRendering={"crispEdges"}
                    />
                    {pointsData}
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
                    x={-height / 2 + 12}
                    y={MARGIN.left - 40}
                    textAnchor="end"
                    stroke={COLORS.TEXT_COLOR}
                    alignmentBaseline="central"
                    fontSize={FONT_SIZE.MEDIUM}
                    transform="rotate(-90)"
                >
                    SSE
                </text>
            </svg>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const { sse_vs_clusters } = await (await axios.get(`${SERVER.hostname}:${SERVER.port}/get_elbow_plot_data`)).data;
    return {
        props: {
            sse_vs_clusters: sse_vs_clusters
        }
    }
}
