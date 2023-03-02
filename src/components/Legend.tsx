import { Box, HStack, Stack } from "@chakra-ui/react";
import * as d3 from "d3";

export default function Legend({ num_components }: { num_components: number }) {
    const colorScheme = d3.schemeSet1;
    return (
        <Box p={2} border={"1px solid black"} borderRadius={"5px"}>
            <Stack direction={"row"} alignItems={"start"} spacing={"50px"}>
                {Array(num_components)
                    .fill(1)
                    .map((_, i) => (
                        <HStack key={i}>
                            <Box
                                w={2}
                                h={2}
                                borderRadius={"50%"}
                                bg={colorScheme[i]}
                            />
                            <Box>Group {i + 1}</Box>
                        </HStack>
                    ))}
            </Stack>
        </Box>
    );
}
