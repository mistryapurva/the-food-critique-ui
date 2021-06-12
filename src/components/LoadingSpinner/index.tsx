import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
}));

const LoadingSpinner = () => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <CircularProgress color={"primary"} />
    </Box>
  );
};

export default LoadingSpinner;
