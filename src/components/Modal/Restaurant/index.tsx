import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import * as Yup from "yup";
import AuthContext from "../../../context/Auth";
import { Restaurant, RestaurantStatus } from "../../../types";
import _isEmpty from "lodash/isEmpty";
import _cloneDeep from "lodash/cloneDeep";
import useWindowSize from "../../../hooks/useWindowSize";
import { MOBILE_BREAKPOINT } from "../../../shared/constants";

interface RestaurantModalProps {
  restaurantToEdit?: Restaurant;
  open: boolean;
  onClose: () => void;
  onSubmit: (restaurant: Restaurant) => void;
}

const validationSchema = new Yup.ObjectSchema({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .matches(/^[a-z\d\-\'\s]+$/i, {
      message: "Name can contain only letters, numbers and spaces",
    }),
  image: Yup.string().trim().url("Must be a valid URL"),
});

const RestaurantModal = (props: RestaurantModalProps) => {
  const user = useContext(AuthContext);
  const { width: windowWidth } = useWindowSize();
  const {
    open,
    onClose = () => {},
    onSubmit = () => {},
    restaurantToEdit,
  } = props;

  const initialValues: Restaurant = !_isEmpty(restaurantToEdit)
    ? _cloneDeep(restaurantToEdit)
    : {
        name: "",
        description: "",
        image: "https://source.unsplash.com/800x600?food",
        owner: user._id,
        status: RestaurantStatus.ACTIVE,
      };

  const handleSubmit = (values: Restaurant) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} fullWidth fullScreen={windowWidth < MOBILE_BREAKPOINT}>
      <DialogTitle>{"Add Restaurant"}</DialogTitle>
      <Formik<Restaurant>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, handleChange }) => {
          return (
            <Form
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <DialogContent>
                <TextField
                  name={"name"}
                  placeholder={"Restaurant Name"}
                  variant={"outlined"}
                  label={"Restaurant name"}
                  fullWidth
                  margin={"normal"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  value={values.name}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  name={"description"}
                  placeholder={"Keywords or cuisine"}
                  variant={"outlined"}
                  label={"Description"}
                  fullWidth
                  margin={"normal"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  value={values.description}
                />
                <TextField
                  name={"image"}
                  placeholder={"Image URL"}
                  variant={"outlined"}
                  label={"Image"}
                  fullWidth
                  margin={"normal"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  value={values.image}
                  error={touched.image && Boolean(errors.image)}
                  helperText={touched.image && errors.image}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>{"Cancel"}</Button>
                <Button variant={"contained"} color={"primary"} type={"submit"}>
                  {"Submit"}
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default RestaurantModal;
