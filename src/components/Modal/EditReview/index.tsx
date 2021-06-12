import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { useContext, useState } from "react";
import { Review, ReviewComment, ReviewStatus } from "../../../types";
import _cloneDeep from "lodash/cloneDeep";
import _get from "lodash/get";
import _find from "lodash/get";
import _map from "lodash/map";
import _size from "lodash/size";
import _set from "lodash/set";
import AuthContext from "../../../context/Auth";

interface EditReviewModalProps {
  open: boolean;
  review: Review;
  onCancel?: () => void;
  onSubmit?: (review: Review) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  reviewDetailsContainer: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
    marginBottom: theme.spacing(2),
  },
}));

const EditReviewModal = (props: EditReviewModalProps) => {
  const user = useContext(AuthContext);
  const classes = useStyles();
  const { open, review, onCancel = () => {}, onSubmit = () => {} } = props;

  const [reviewToEdit, setReviewToEdit] = useState(_cloneDeep(review));

  const handleChangeRating = (e: React.ChangeEvent, value: number) => {
    setReviewToEdit((oldReview) => ({
      ...oldReview,
      rating: value,
    }));
  };

  const handleChangeAuthorComment = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReviewToEdit((oldReview) => ({
      ...oldReview,
      comment: e.target.value,
    }));
  };

  const handleChangeOwnerComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    let otherComments: Array<ReviewComment> = [];
    if (_size(_get(reviewToEdit, "otherComments", [])) > 0) {
      otherComments = _cloneDeep(reviewToEdit.otherComments);
      _set(otherComments, "[0].comment", e.target.value);
    } else {
      otherComments.push({
        author: user,
        comment: e.target.value,
        status: ReviewStatus.ACTIVE,
      });
    }

    setReviewToEdit((oldReview) => ({
      ...oldReview,
      otherComments,
    }));
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{"Edit Review"}</DialogTitle>
      <DialogContent>
        <Typography variant={"subtitle2"}>{"Review Details"}</Typography>
        <Box className={classes.reviewDetailsContainer}>
          <Typography>
            {`Restaurant: `}
            <strong>{_get(reviewToEdit, "restaurant.name", "")}</strong>
          </Typography>
          <Typography>
            {`Review Author: `}
            <strong>{_get(reviewToEdit, "author.name", "")}</strong>
          </Typography>
        </Box>
        <Box>
          <Typography>{"Rating"}</Typography>
          <Box display={"flex"} alignItems={"center"} marginBottom={2}>
            <Rating
              value={reviewToEdit.rating}
              onChange={handleChangeRating}
              name={"restaurant-rating"}
              precision={0.5}
            />
            <Typography variant={"subtitle2"} style={{ marginLeft: 8 }}>
              {reviewToEdit.rating}
            </Typography>
          </Box>
          <TextField
            label={"Author Comment"}
            variant={"outlined"}
            multiline
            fullWidth
            rows={3}
            rowsMax={3}
            value={reviewToEdit.comment || ""}
            InputLabelProps={{
              shrink: true,
            }}
            margin={"normal"}
            onChange={handleChangeAuthorComment}
          />

          <TextField
            label={"Owner Comment"}
            variant={"outlined"}
            multiline
            fullWidth
            rows={3}
            margin={"normal"}
            rowsMax={3}
            value={_get(reviewToEdit, "otherComments[0].comment", "")}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChangeOwnerComment}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{"Cancel"}</Button>
        <Button
          color={"primary"}
          variant={"contained"}
          onClick={() => onSubmit(reviewToEdit)}
        >
          {"Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReviewModal;
