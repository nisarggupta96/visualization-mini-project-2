import Head from 'next/head';
import NextLink from 'next/link';
import { ReactNode } from 'react';
import {
    Box,
    Flex,
    Heading,
    HStack,
    Link,
    useColorModeValue,
} from '@chakra-ui/react';

const Links = [
    { linkName: 'Scree Plot', linkHref: '/scree-plot' },
    { linkName: 'Bi-Plot', linkHref: '/bi-plot' },
    { linkName: 'Feature Table', linkHref: '/feature-table' },
    { linkName: 'Scatter Plot Matrix', linkHref: '/scatter-plot-matrix' },
    { linkName: 'Elbow Plot', linkHref: '/elbow-plot' },
    { linkName: 'Clustering', linkHref: '/clustering' }
];

const NavLink = ({ linkName, linkHref }: { linkName: string, linkHref: string }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        as={NextLink}
        href={linkHref}>
        {linkName}
    </Link>
);

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>Visualization Mini Project 2</title>
                <meta name="description" content="Visualization Mini Project 2" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                    <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                        <HStack spacing={8} alignItems={'center'}>
                            <Heading size={"md"}>Visualization</Heading>
                            <HStack
                                as={'nav'}
                                spacing={4}
                                display={{ base: 'none', md: 'flex' }}>
                                {Links.map(({ linkHref, linkName }, index) => (
                                    <NavLink key={index} linkHref={linkHref} linkName={linkName} />
                                ))}
                            </HStack>
                        </HStack>
                    </Flex>
                </Box>

                <Box p={4}>
                    {children}
                </Box>
            </main>
        </>
    )
}
