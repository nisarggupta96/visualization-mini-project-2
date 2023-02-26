import { Box, Center, Grid, GridItem, Heading } from '@chakra-ui/react';
import axios from 'axios';
import { GetStaticProps } from 'next';
import * as d3 from 'd3';
import { ScatterPlot } from '@/components/ScatterPlot';

export default function ScatterPlotMatrix({ bi_plot_pca_sorted, scatter_data }: { bi_plot_pca_sorted: Object[], scatter_data: Object[] }) {
    
    const selected_columns = bi_plot_pca_sorted.slice(0, 4).map(x => x['attr_name']);
    const min_max_values = {};
    selected_columns.forEach((col) => {
        min_max_values[col] = {
            min_val: d3.min(Object.values(scatter_data[col])),
            max_val: d3.max(Object.values(scatter_data[col]))
        }
    });

    const allPlots = [];
    selected_columns.forEach((yCol) => {
        selected_columns.forEach((xCol) => {
            allPlots.push({
                xCol,
                yCol
            })
        });
    })

    return (
        <Box>
            <Center>
                <Heading size={"md"}>Scatter Plot Matrix</Heading>
            </Center>
            <Grid templateColumns='repeat(4, 1fr)' gap={5} ml={5}>
                {allPlots.map((plot, ind) => {
                    return (<GridItem key={ind} w='100%' h="325px">
                        <ScatterPlot
                            width={"325"}
                            height={"325"}
                            margins={"50"}
                            xCol={plot.xCol}
                            yCol={plot.yCol}
                            data={scatter_data}
                            min_max_values={min_max_values}
                            shouldDisplayXColumn={ind > 11}
                            shouldDisplayYColumn={ind % 4 == 0}
                        />
                    </GridItem>)
                })}
            </Grid>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const {bi_plot_pca_sorted, scatter_data} = await (await axios.get('http://127.0.0.1:5000/get_scatter_data')).data;
    return {
        props: {
            bi_plot_pca_sorted: bi_plot_pca_sorted,
            scatter_data: scatter_data
        }
    }
}
