import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  makeStyles,
  Paper,
  Switch,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { ASSETS } from "../../../theme/assets";
import { UserType } from "../../../types";

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserType;
}

interface SignUpFormProps {
  onLogin?: () => void;
  onSignUp?: (data: SignUpData) => void;
}

const validationSchema = new Yup.ObjectSchema({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Must be a valid email"),
  password: Yup.string()
    .trim()
    .required("Password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
      message:
        "Password must have at least: 8 characters, 1 lowercase character, 1 uppercase character, 1 special character, 1 number",
    }),
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

const signUpInitialValues: SignUpData = {
  email: "",
  password: "",
  name: "",
  role: UserType.USER,
};

const SignUpForm = (props: SignUpFormProps) => {
  const classes = useStyles();
  const { onLogin = () => {}, onSignUp = () => {} } = props;

  const handleSubmit = (values: SignUpData) => {
    onSignUp(values);
  };

  return (
    <Box className={classes.container}>
      <img src={ASSETS.logoFull} className={classes.img} />
      <Container maxWidth={"sm"}>
        <Card elevation={3} className={classes.formContainer}>
          <CardContent>
            <Typography align={"center"} variant={"h4"} paragraph>
              {"Sign Up"}
            </Typography>
            <Formik
              initialValues={signUpInitialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({ values, touched, errors, handleChange, setFieldValue }) => {
                return (
                  <Form>
                    <TextField
                      label={"Name"}
                      name={"name"}
                      value={values.name}
                      onChange={handleChange}
                      margin={"normal"}
                      placeholder={"e.g. John Smith"}
                      fullWidth
                      variant={"outlined"}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
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
                    <FormControl margin={"normal"} fullWidth>
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Typography>{"Are you a restaurant owner?"}</Typography>
                        <Switch
                          name={"role"}
                          checked={values.role === UserType.OWNER}
                          onChange={(e: any, checked: boolean) => {
                            setFieldValue(
                              "role",
                              checked ? UserType.OWNER : UserType.USER
                            );
                          }}
                        />
                      </Box>
                    </FormControl>
                    <Button
                      color={"primary"}
                      variant={"contained"}
                      fullWidth
                      size={"large"}
                      type={"submit"}
                    >
                      {"Sign Up"}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </CardContent>
          <CardActions style={{ justifyContent: "flex-end" }}>
            <Button onClick={onLogin}>{"Already registered? Log In"}</Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
};

export default SignUpForm;
