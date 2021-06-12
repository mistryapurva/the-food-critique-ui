import {
  Avatar,
  Box,
  Card,
  colors,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import _get from "lodash/get";
import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../../context/Auth";
import { User, UserStatus, UserType } from "../../../types";
import { getInitialsFromName } from "../../../utils";
import clsx from "clsx";

interface UserCardProps extends User {
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    position: "relative",
  },
  inactive: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
}));

const UserCard = (props: UserCardProps) => {
  const classes = useStyles();
  const {
    onEdit = () => {},
    onDelete = () => {},
    onActivate = () => {},
  } = props;
  const user = useContext(AuthContext);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const adminMenuIconRef = useRef();

  return (
    <>
      <Card className={classes.card}>
        {props.status === UserStatus.INACTIVE ? (
          <Box className={classes.inactive}></Box>
        ) : null}
        <ListItem>
          <ListItemAvatar>
            <Avatar>{getInitialsFromName(_get(props, "name", ""))}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={_get(props, "name", "")}
            secondary={_get(props, "role", UserType.USER)}
          />
          {user.role === UserType.ADMIN ? (
            <ListItemIcon style={{ minWidth: 20 }}>
              <IconButton
                ref={adminMenuIconRef}
                onClick={() => setShowAdminMenu(true)}
              >
                <MoreVert />
              </IconButton>
            </ListItemIcon>
          ) : null}
        </ListItem>
      </Card>
      {showAdminMenu ? (
        <Menu
          open={showAdminMenu}
          onClose={() => setShowAdminMenu(false)}
          anchorEl={_get(adminMenuIconRef, "current")}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {props.status === UserStatus.ACTIVE ? (
            <MenuItem
              onClick={() => {
                onEdit();
                setShowAdminMenu(false);
              }}
            >
              {"Edit"}
            </MenuItem>
          ) : null}
          {props.status === UserStatus.ACTIVE ? (
            <MenuItem
              onClick={() => {
                onDelete();
                setShowAdminMenu(false);
              }}
            >
              {"Delete"}
            </MenuItem>
          ) : null}
          {props.status === UserStatus.INACTIVE ? (
            <MenuItem
              onClick={() => {
                onActivate();
                setShowAdminMenu(false);
              }}
            >
              {"Enable"}
            </MenuItem>
          ) : null}
        </Menu>
      ) : null}
    </>
  );
};

export default UserCard;
