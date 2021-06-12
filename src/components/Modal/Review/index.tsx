import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Restaurant, Review, User } from "../../../types";
import _get from "lodash/get";
import { Rating } from "@material-ui/lab";
import AuthContext from "../../../context/Auth";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import useWindowSize from "../../../hooks/useWindowSize";
import { MOBILE_BREAKPOINT } from "../../../shared/constants";

interface ReviewModalProps {
  restaurant: Restaurant;
  open: boolean;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

const ReviewModal = (props: ReviewModalProps) => {
  const { width: windowWidth } = useWindowSize();
  const user: User = useContext(AuthContext);
  const { restaurant, open, onClose = () => {}, onSubmit = () => {} } = props;
  const [review, setReview] = useState<Review>({
    rating: 0,
    comment: "",
    author: user,
    dateVisit: null,
    restaurant: restaurant,
  });

  const handleChangeRating = (e: React.ChangeEvent, value: number) => {
    setReview((oldReview) => ({
      ...oldReview,
      rating: value,
    }));
  };

  const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setReview((oldReview) => ({
      ...oldReview,
      comment: value,
    }));
  };

  const handleDateChange = (date: moment.Moment, value: string) => {
    setReview((oldReview) => ({
      ...oldReview,
      dateVisit: value,
    }));
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"xs"}
      fullScreen={windowWidth < MOBILE_BREAKPOINT}
    >
      <DialogContent>
        <Typography paragraph>{`Rate your experience for ${_get(
          restaurant,
          "name",
          ""
        )}`}</Typography>
        <Box display={"flex"} alignItems={"center"} marginBottom={2}>
          <Rating
            value={review.rating}
            onChange={handleChangeRating}
            name={"restaurant-rating"}
            precision={0.5}
          />
          <Typography variant={"subtitle2"} style={{ marginLeft: 8 }}>
            {review.rating > 0 ? review.rating : null}
          </Typography>
        </Box>
        <TextField
          label={"Review"}
          variant={"outlined"}
          multiline
          rows={5}
          rowsMax={5}
          fullWidth
          margin={"normal"}
          placeholder={"Add a review"}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChangeComment}
          value={review.comment}
        />
        <FormControl variant={"outlined"}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/DD/YYYY"
              margin="normal"
              id="date-picker-inline"
              label="Date of Visit"
              disableFuture
              value={review.dateVisit}
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{"Cancel"}</Button>
        <Button
          disabled={!review.rating}
          color={"primary"}
          variant={"contained"}
          onClick={() => onSubmit(review)}
        >
          {"Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
