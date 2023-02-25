import axios from 'axios';
import { GetStaticProps } from 'next';
import { SERVER } from '@/constants';
import {
    Box,
    Center,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';

export default function FeatureTable({ bi_plot_pca_components, bi_plot_columns }: { bi_plot_pca_components: Number[], bi_plot_columns: String[] }) {

    return (
        <Box>
            <Center>
                <Heading>Feature Table</Heading>
            </Center>
            <TableContainer>
                <Table m={"auto"} mt={"100px"} width="50%" variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Attribute</Th>
                            <Th isNumeric>PC1</Th>
                            <Th isNumeric>PC2</Th>
                            <Th isNumeric>Sum Squared Loading</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bi_plot_pca_components.map((row, index) => (
                            <Tr key={index}>
                                <Td>{bi_plot_columns[index]}</Td>
                                <Td isNumeric>{row[0].toFixed(6)}</Td>
                                <Td isNumeric>{row[1].toFixed(6)}</Td>
                                <Td isNumeric>{Math.sqrt(Math.pow(row[0], 2) + Math.pow(row[1], 2)).toFixed(6)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const { bi_plot_pca_components, bi_plot_columns } = await (await axios.get(`${SERVER.hostname}:${SERVER.port}/get_bi_plot_data`)).data;
    return {
        props: {
            bi_plot_pca_components: bi_plot_pca_components,
            bi_plot_columns: bi_plot_columns
        }
    }
}
