import { Box, Center, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import { GetStaticProps } from "next";
import * as d3 from "d3";
import { ScatterPlot } from "@/components/ScatterPlot";
import { useContext, useEffect, useState } from "react";
import DIndexContext from "@/context/dindex";
import Legend from "@/components/Legend";
import { SERVER } from "@/constants";

export default function ScatterPlotMatrix() {
    const [bi_plot_pca_sorted, set_bi_plot_pca_sorted] = useState([]);
    const [scatter_data, set_scatter_data] = useState({});

    const { currentDimensions } = useContext(DIndexContext);

    useEffect(() => {
        const getData = async () => {
            const data = await (
                await axios.get(
                    `api/scatter-plot-matrix?di=${currentDimensions}`
                )
            ).data;
            set_bi_plot_pca_sorted(data["bi_plot_pca_sorted"]);
            set_scatter_data(data["scatter_data"]);
        };
        getData();
    }, [currentDimensions]);

    if (!bi_plot_pca_sorted || !scatter_data) {
        return null;
    }

    const selected_columns = bi_plot_pca_sorted
        .slice(0, 4)
        .map((x) => x["attr_name"]);
    const min_max_values = {};
    selected_columns.forEach((col) => {
        min_max_values[col] = {
            min_val: d3.min(Object.values(scatter_data[col])),
            max_val: d3.max(Object.values(scatter_data[col])),
        };
    });

    const allPlots = [];
    selected_columns.forEach((yCol) => {
        selected_columns.forEach((xCol) => {
            allPlots.push({
                xCol,
                yCol,
            });
        });
    });

    return (
        <Box>
            <Center>
                <Heading size={"md"}>Scatter Plot Matrix</Heading>
            </Center>
            <Box
                display={"flex"}
                justifyContent={"center"}
                alignContent={"center"}
                mt={"50px"}
            >
                <Legend num_components={3} />
            </Box>
            <Grid templateColumns="repeat(4, 1fr)" gap={5} mt={"50px"}>
                {allPlots.map((plot, ind) => {
                    if (plot.xCol === plot.yCol) {
                        return (
                            <Box
                                key={ind}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Text as="samp" fontSize="3xl">
                                    {plot.xCol}
                                </Text>
                            </Box>
                        );
                    }
                    return (
                        <GridItem key={ind} w="100%" h="325px">
                            <ScatterPlot
                                width={"330"}
                                height={"325"}
                                margins={"50"}
                                xCol={plot.xCol}
                                yCol={plot.yCol}
                                data={scatter_data}
                                min_max_values={min_max_values}
                                shouldDisplayXColumn={false}
                                shouldDisplayYColumn={false}
                            />
                        </GridItem>
                    );
                })}
            </Grid>
        </Box>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const { bi_plot_pca_sorted, scatter_data } = await (
        await axios.get(`${SERVER.hostname}:${SERVER.port}/get_scatter_data`)
    ).data;
    return {
        props: {
            bi_plot_pca_sorted: bi_plot_pca_sorted,
            scatter_data: scatter_data,
        },
    };
};
