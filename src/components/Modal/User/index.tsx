import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { User, UserType } from "../../../types";

interface UserModalProps {
  user: User;
  open: boolean;
  onCancel: () => void;
  onSubmit: (user: User) => void;
}

const UserModal = (props: UserModalProps) => {
  const { user, open, onCancel = () => {}, onSubmit = () => {} } = props;

  const [userToEdit, setUserToEdit] = useState(user);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{"Update User"}</DialogTitle>
      <Formik initialValues={user} onSubmit={onSubmit}>
        {({ values, touched, errors, handleChange, setFieldValue }) => {
          return (
            <Form>
              <DialogContent>
                <TextField
                  label={"Name"}
                  name={"name"}
                  onChange={handleChange}
                  fullWidth
                  variant={"outlined"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin={"normal"}
                  value={values.name}
                />
                <TextField
                  label={"Email"}
                  name={"email"}
                  onChange={handleChange}
                  fullWidth
                  variant={"outlined"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                  margin={"normal"}
                  value={values.email}
                />
                <FormControl margin={"normal"}>
                  <ToggleButtonGroup value={values.role}>
                    <ToggleButton
                      value={UserType.ADMIN}
                      onClick={() => {
                        setFieldValue("role", UserType.ADMIN);
                      }}
                    >
                      {UserType.ADMIN}
                    </ToggleButton>
                    <ToggleButton
                      value={UserType.OWNER}
                      onClick={() => {
                        setFieldValue("role", UserType.OWNER);
                      }}
                    >
                      {UserType.OWNER}
                    </ToggleButton>
                    <ToggleButton
                      value={UserType.USER}
                      onClick={() => {
                        setFieldValue("role", UserType.USER);
                      }}
                    >
                      {UserType.USER}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={onCancel}>{"Cancel"}</Button>
                <Button type={"submit"} color={"primary"} variant={"contained"}>
                  {"Save"}
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default UserModal;
