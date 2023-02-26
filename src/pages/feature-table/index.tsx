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

export default function FeatureTable({ bi_plot_pca_sorted }: { bi_plot_pca_sorted: Object[] }) {

    return (
        <Box>
            <Center>
                <Heading size={"md"}>Feature Table</Heading>
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
                        {bi_plot_pca_sorted.map((row, index) => (
                            <Tr key={index}>
                                <Td>{row.attr_name}</Td>
                                <Td isNumeric>{+row.pc1_val.toFixed(6)}</Td>
                                <Td isNumeric>{+row.pc2_val.toFixed(6)}</Td>
                                <Td isNumeric>{+row.ssl.toFixed(6)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const { bi_plot_pca_sorted } = await (await axios.get(`${SERVER.hostname}:${SERVER.port}/get_bi_plot_data`)).data;
    return {
        props: {
            bi_plot_pca_sorted: bi_plot_pca_sorted,
        }
    }
}
