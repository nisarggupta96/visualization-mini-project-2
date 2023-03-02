import axios from "axios";
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
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import DIndexContext from "@/context/dindex";

export default function FeatureTable() {
    const [bi_plot_pca_sorted, set_bi_plot_pca_sorted] = useState([]);
    const { currentDimensions } = useContext(DIndexContext);

    useEffect(() => {
        const getData = async () => {
            const data = await (
                await axios.get(`api/feature-table?di=${currentDimensions}`)
            ).data;
            set_bi_plot_pca_sorted(data);
        };
        getData();
    }, [currentDimensions]);

    return (
        bi_plot_pca_sorted && (
            <Box>
                <Center>
                    <Heading size={"md"}>PCA Loadings</Heading>
                </Center>
                <TableContainer>
                    <Table m={"auto"} mt={"100px"} width="50%" variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Attribute</Th>
                                {Array.from({ length: currentDimensions }).map(
                                    (v, i) => (
                                        <Th isNumeric key={`th_${i}`}>{`PC${
                                            i + 1
                                        }`}</Th>
                                    )
                                )}
                                <Th isNumeric>Sum Squared Loading</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bi_plot_pca_sorted.map((row, index) => (
                                <Tr key={index}>
                                    <Td>{row.attr_name}</Td>
                                    {Array.from({
                                        length: currentDimensions,
                                    }).map((v, i) => (
                                        <Td isNumeric key={`td_${i}`}>
                                            {
                                                +row[
                                                    `pca_component_${i + 1}`
                                                ].toFixed(6)
                                            }
                                        </Td>
                                    ))}
                                    <Td isNumeric>{+row.ssl.toFixed(6)}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        )
    );
}
