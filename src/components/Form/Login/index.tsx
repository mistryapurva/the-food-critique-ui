import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ASSETS } from "../../../theme/assets";

export interface LoginData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLogin?: (data: LoginData) => void;
  onSignUp?: () => void;
}

const validationSchema = new Yup.ObjectSchema({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Must be a valid email"),
  password: Yup.string().trim().required("Password is required"),
});

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  formContainer: {
    // padding: theme.spacing(2),
  },
  img: {
    height: 200,
  },
}));

const loginInitialValues: LoginData = {
  email: "",
  password: "",
};

const LoginForm = (props: LoginFormProps) => {
  const classes = useStyles();
  const { onLogin = () => {}, onSignUp = () => {} } = props;

  const handleSubmit = (values: LoginData) => {
    onLogin(values);
  };

  return (
    <Box className={classes.container}>
      <img src={ASSETS.logoFull} className={classes.img} />
      <Container maxWidth={"sm"}>
        <Card elevation={3} className={classes.formContainer}>
          <CardContent>
            <Typography align={"center"} variant={"h4"} paragraph>
              {"Login"}
            </Typography>
            <Formik
              initialValues={loginInitialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({ values, touched, errors, handleChange }) => {
                return (
                  <Form>
                    <TextField
                      label={"Email"}
                      name={"email"}
                      value={values.email}
                      onChange={handleChange}
                      margin={"normal"}
                      placeholder={"abc@example.com"}
                      fullWidth
                      variant={"outlined"}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                    <TextField
                      label={"Password"}
                      name={"password"}
                      value={values.password}
                      onChange={handleChange}
                      placeholder={"Password"}
                      margin={"normal"}
                      InputProps={{
                        type: "password",
                      }}
                      fullWidth
                      variant={"outlined"}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                    <Button
                      color={"primary"}
                      variant={"contained"}
                      fullWidth
                      size={"large"}
                      type={"submit"}
                    >
                      {"Login"}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </CardContent>
          <CardActions style={{ justifyContent: "flex-end" }}>
            <Button onClick={onSignUp}>{"New User? Sign Up"}</Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginForm;
