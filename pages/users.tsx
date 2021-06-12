import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getAllUsers, updateUser } from "../src/api/user";
import LoadingSpinner from "../src/components/LoadingSpinner";
import _map from "lodash/map";
import _get from "lodash/get";
import { User, UserStatus } from "../src/types";
import UserCard from "../src/components/Card/User";
import _isEmpty from "lodash/isEmpty";
import UserModal from "../src/components/Modal/User";
import Head from "next/head";
import { Alert } from "@material-ui/lab";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<User>>([]);
  const [userToEdit, setUserToEdit] = useState<User>(null);
  const [userToDelete, setUserToDelete] = useState<User>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        setError(String(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmitUser = (user: User) => {
    setLoading(true);
    setUserToEdit(null);
    setUserToDelete(null);
    updateUser(user)
      .then((updatedUser: User) => {
        const newUsers = _map(users, (u) => {
          if (u._id === updatedUser._id) {
            return updatedUser;
          }
          return u;
        });

        setUsers(newUsers);
      })
      .catch((error) => {
        setError(String(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>{"The Food Critique | Users"}</title>
      </Head>
      {loading ? <LoadingSpinner /> : null}
      <Grid container spacing={2}>
        {_map(users, (user) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={_get(user, "_id")}>
              <UserCard
                {...user}
                onEdit={() => setUserToEdit(user)}
                onDelete={() => {
                  setUserToDelete({
                    ...user,
                    status: UserStatus.INACTIVE,
                  });
                }}
                onActivate={() => {
                  handleSubmitUser({
                    ...user,
                    status: UserStatus.ACTIVE,
                  });
                }}
              />
            </Grid>
          );
        })}
      </Grid>
      {!_isEmpty(userToEdit) ? (
        <UserModal
          open={!_isEmpty(userToEdit)}
          user={userToEdit}
          onCancel={() => setUserToEdit(null)}
          onSubmit={handleSubmitUser}
        />
      ) : null}
      {!_isEmpty(userToDelete) ? (
        <Dialog open={!_isEmpty(userToDelete)}>
          <DialogTitle>{"Delete User?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`${_get(
                userToDelete,
                "name",
                ""
              )} will be marked as Inactive. Are you sure?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserToDelete(null)}>{"Cancel"}</Button>
            <Button
              color={"secondary"}
              variant={"contained"}
              onClick={() => {
                handleSubmitUser(userToDelete);
              }}
            >
              {"Yes, Continue"}
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(error)}
        onClose={() => setError("")}
      >
        <Alert variant={"filled"} severity={"error"}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Users;
