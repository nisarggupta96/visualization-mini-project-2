import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "@/components/CommonLayout";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <Analytics />
        </ChakraProvider>
    );
}
