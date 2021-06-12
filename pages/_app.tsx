import { Container } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import App from "next/app";
import Head from "next/head";
import React from "react";
import AuthWrapper from "../src/components/Wrapper/Auth";
import theme from "../src/theme";
import "../src/theme/styles.css";

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>{"The Food Critique"}</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <AuthWrapper>
            <Container maxWidth={"md"} style={{ paddingTop: 24 }}>
              <Component {...pageProps} />
            </Container>
          </AuthWrapper>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
