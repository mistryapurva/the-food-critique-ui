import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ReplyIcon from "@material-ui/icons/Reply";
import { Rating } from "@material-ui/lab";
import _get from "lodash/get";
import _trim from "lodash/trim";
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";
import _first from "lodash/first";
import moment from "moment";
import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../../context/Auth";
import {
  Restaurant,
  Review,
  ReviewComment,
  ReviewStatus,
  UserType,
} from "../../../types";
import { getInitialsFromName } from "../../../utils";
import { addCommentToReview } from "../../../api/reviews";
import { MoreVert } from "@material-ui/icons";

interface ReviewCardProps extends Review {
  restaurantProps: Restaurant;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  cardContent: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
  },
  comment: {
    marginTop: theme.spacing(1),
  },
  rating: {
    marginLeft: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
  },
  author: {
    fontSize: theme.typography.pxToRem(18),
  },
  replyContainer: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
    padding: theme.spacing(1),
    borderRadius: 10,
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

const ReviewCard = (props: ReviewCardProps) => {
  const classes = useStyles();
  const user = useContext(AuthContext);

  const {
    onEdit = () => {},
    onDelete = () => {},
    onActivate = () => {},
  } = props;

  let ownerReply: ReviewComment = _first(_get(props, "otherComments", []));

  if (_isEmpty(ownerReply)) {
    ownerReply = {
      author: user,
      comment: "",
      status: ReviewStatus.ACTIVE,
    };
  }

  const [loading, setLoading] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [ownerComment, setOwnerComment] = useState<ReviewComment>(ownerReply);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const adminMenuIconRef = useRef();

  const handleChangeReplyText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerComment({
      ...ownerComment,
      comment: e.target.value,
    });
  };

  const handleAddComment = () => {
    setLoading(true);
    addCommentToReview(props._id, ownerComment).finally(() => {
      setShowReplyInput(false);
      setLoading(false);
    });
  };

  return (
    <>
      <Card elevation={3} className={classes.card}>
        {props.status === ReviewStatus.INACTIVE ? (
          <Box className={classes.inactive}></Box>
        ) : null}
        {user.role === UserType.ADMIN ? (
          <CardHeader
            title={_get(props, "restaurantProps.name", "")}
          ></CardHeader>
        ) : null}
        <ListItem divider>
          <ListItemAvatar>
            <Avatar>
              {getInitialsFromName(_get(props, "author.name", ""))}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={_get(props, "author.name", "")}
            secondary={
              props.dateVisit
                ? `Visited on: ${moment(props.dateVisit).format(
                    "MMM DD, YYYY"
                  )}`
                : ""
            }
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
        <CardContent className={classes.cardContent}>
          <Box flex={1}>
            <Box display={"flex"} alignItems={"center"}>
              <Rating value={_get(props, "rating")} readOnly precision={0.1} />
              <Typography className={classes.rating}>
                {props.rating ? props.rating.toFixed(1) : null}
              </Typography>
              {props.updatedOn ? (
                <Typography variant={"caption"} className={classes.rating}>
                  {moment(props.updatedOn, "YYYYMMDDHHmmss").format(
                    "MMM DD, YYYY"
                  )}
                </Typography>
              ) : null}
            </Box>
            <Typography variant={"body1"} className={classes.comment}>
              {_get(props, "comment")}
            </Typography>

            {showReplyInput ? (
              <Box marginTop={1}>
                <TextField
                  fullWidth
                  autoFocus
                  variant={"outlined"}
                  placeholder={"Reply"}
                  onChange={handleChangeReplyText}
                  value={_get(ownerComment, "comment")}
                  multiline
                  rows={2}
                  rowsMax={4}
                />
                <Toolbar
                  disableGutters
                  variant={"dense"}
                  style={{ justifyContent: "flex-end" }}
                >
                  <Button
                    onClick={() => {
                      setOwnerComment(null);
                      setShowReplyInput(false);
                    }}
                  >
                    {"Cancel"}
                  </Button>
                  <Button
                    color={"primary"}
                    variant={"contained"}
                    onClick={handleAddComment}
                    disabled={!_trim(_get(ownerComment, "comment"))}
                  >
                    {loading ? (
                      <CircularProgress color={"inherit"} size={20} />
                    ) : (
                      "Reply"
                    )}
                  </Button>
                </Toolbar>
              </Box>
            ) : !_isEmpty(ownerComment.comment) ? (
              <Box className={classes.replyContainer}>
                <Typography>
                  <em>{_get(ownerComment, "comment", "")}</em>
                </Typography>
                <Typography align={"right"}>{`- ${_get(
                  props,
                  "restaurantProps.name",
                  ""
                )} Management`}</Typography>
              </Box>
            ) : null}
          </Box>
          {user.role === UserType.OWNER &&
          !showReplyInput &&
          _isEmpty(ownerComment.comment) ? (
            <IconButton onClick={() => setShowReplyInput(true)}>
              <ReplyIcon />
            </IconButton>
          ) : null}
        </CardContent>
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
          {props.status === ReviewStatus.ACTIVE ? (
            <MenuItem
              onClick={() => {
                onEdit();
                setShowAdminMenu(false);
              }}
            >
              {"Edit"}
            </MenuItem>
          ) : null}

          {props.status === ReviewStatus.ACTIVE ? (
            <MenuItem
              onClick={() => {
                onDelete();
                setShowAdminMenu(false);
              }}
            >
              {"Delete"}
            </MenuItem>
          ) : null}

          {props.status === ReviewStatus.INACTIVE ? (
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

export default ReviewCard;
