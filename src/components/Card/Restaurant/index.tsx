import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useContext, useRef, useState } from "react";
import _trim from "lodash/trim";
import { Rating } from "@material-ui/lab";
import AuthContext from "../../../context/Auth";
import { RestaurantStatus, UserType } from "../../../types";
import { MoreVert } from "@material-ui/icons";
import _get from "lodash/get";

interface RestaurantCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  imageBase64: string;
  avgRating: number;
  status: RestaurantStatus;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  media: {
    height: 200,
  },
  name: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
  avgRating: {
    padding: theme.spacing(0.5, 1),
    backgroundColor: theme.palette.success.light,
    borderRadius: 5,
  },
  menuIcon: {
    position: "absolute",
    top: 200,
    right: theme.spacing(1.5),
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

const RestaurantCard = (props: RestaurantCardProps) => {
  const classes = useStyles();
  const user = useContext(AuthContext);
  const {
    name,
    description,
    image,
    imageBase64,
    avgRating,
    onClick = () => {},
    onEdit = () => {},
    onDelete = () => {},
    onActivate = () => {},
  } = props;

  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const adminMenuIconRef = useRef();

  let descriptionShort = _trim(description);
  if (descriptionShort.length > 100) {
    descriptionShort = `${descriptionShort.substr(0, 100)}...`;
  }

  return (
    <>
      <Card elevation={3} style={{ position: "relative" }}>
        {props.status === RestaurantStatus.INACTIVE ? (
          <Box className={classes.inactive}></Box>
        ) : null}
        <CardActionArea
          onClick={onClick}
          disableRipple
          disabled={user.role === UserType.ADMIN}
        >
          <CardMedia
            component={"img"}
            src={imageBase64}
            className={classes.media}
          />
          <CardContent>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              marginBottom={1}
            >
              <Typography className={classes.name}>{name}</Typography>
            </Box>

            <Box display={"flex"} alignItems={"center"}>
              <Rating
                value={avgRating}
                readOnly
                precision={0.1}
                style={{ flex: 1 }}
              />
              {!avgRating ? (
                <Typography variant={"caption"} style={{ marginLeft: 8 }}>
                  {"(Not enough reviews)"}
                </Typography>
              ) : (
                <Typography variant={"caption"} className={classes.avgRating}>
                  {avgRating.toFixed(1)}
                </Typography>
              )}
            </Box>
            <Typography variant={"subtitle1"}>{descriptionShort}</Typography>
          </CardContent>
        </CardActionArea>
        {user.role === UserType.ADMIN || user.role === UserType.OWNER ? (
          <IconButton
            className={classes.menuIcon}
            edge={"end"}
            ref={adminMenuIconRef}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setShowAdminMenu(true);
            }}
          >
            <MoreVert />
          </IconButton>
        ) : null}
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
          {props.status === RestaurantStatus.ACTIVE ? (
            <MenuItem
              onClick={() => {
                onEdit();
                setShowAdminMenu(false);
              }}
            >
              {"Edit"}
            </MenuItem>
          ) : null}
          {props.status === RestaurantStatus.ACTIVE ? (
            <MenuItem
              onClick={() => {
                onDelete();
                setShowAdminMenu(false);
              }}
            >
              {"Delete"}
            </MenuItem>
          ) : null}
          {props.status === RestaurantStatus.INACTIVE ? (
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

export default RestaurantCard;
