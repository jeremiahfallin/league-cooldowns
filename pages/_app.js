import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "body, html": {
        minWidth: "100%",
        minHeight: "100%",
        height: "100%",
        width: "100%",
        overflowX: "hidden",
        background: "gray.100",
        color: "black",
      },
      "div#__next": {
        height: "100%",
        width: "100%",
      },
      "div#__next > div": {
        height: "100%",
        width: "100%",
      },
      "&::-webkit-scrollbar": {
        width: "4px",
      },
      "&::-webkit-scrollbar-track": {
        background: "white",
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "gray.400",
        borderRadius: "24px",
      },
    },
  },
  fonts: {
    heading: "Raleway, sans-serif",
    body: "Raleway, sans-serif",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
