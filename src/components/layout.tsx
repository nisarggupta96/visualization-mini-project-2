import Head from "next/head";
import NextLink from "next/link";
import {
    Box,
    Flex,
    Heading,
    HStack,
    Link,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import DIndexContext from "@/context/dindex";
import { useRouter } from "next/router";

const Links = [
    // { linkName: "Home", linkHref: "/" },
    { linkName: "Scree Plot", linkHref: "/scree-plot" },
    { linkName: "Bi-Plot", linkHref: "/bi-plot" },
    { linkName: "PCA Loadings", linkHref: "/feature-table" },
    { linkName: "Scatter Plot Matrix", linkHref: "/scatter-plot-matrix" },
    { linkName: "Elbow Plot", linkHref: "/elbow-plot" },
    { linkName: "Clustering", linkHref: "/clustering" },
];

const NavLink = ({
    linkName,
    linkHref,
    isActive,
}: {
    linkName: string;
    linkHref: string;
    isActive: boolean;
}) => (
    <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
        }}
        as={NextLink}
        href={linkHref}
        color={isActive ? "#2F2E61" : "black"}
        fontWeight={isActive ? "bold" : "normal"}
    >
        {linkName}
    </Link>
);

export default function Layout({ children }) {
    const [dimenIndex, setDimenIndex] = useState(2);
    const { pathname } = useRouter();
    return (
        <>
            <Head>
                <title>Visualization Mini Project 2</title>
                <meta
                    name="description"
                    content="Visualization Mini Project 2"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main>
                <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
                    <Flex
                        h={16}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <HStack spacing={8} alignItems={"center"}>
                            <Heading size={"md"}>Visualization II</Heading>
                            <HStack
                                as={"nav"}
                                spacing={4}
                                display={{ base: "none", md: "flex" }}
                            >
                                {Links.map(({ linkHref, linkName }, index) => (
                                    <NavLink
                                        key={index}
                                        linkHref={linkHref}
                                        linkName={linkName}
                                        isActive={pathname === linkHref}
                                    />
                                ))}
                            </HStack>
                        </HStack>
                    </Flex>
                </Box>

                <Box p={4}>
                    <DIndexContext.Provider
                        value={{
                            currentDimensions: dimenIndex,
                            modifyDimensions: (val) => setDimenIndex(val),
                        }}
                    >
                        {children}
                    </DIndexContext.Provider>
                </Box>
            </main>
        </>
    );
}
