import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@material-ui/core";
import _get from "lodash/get";
import React, { useContext, useState } from "react";
import AuthContext from "../../../context/Auth";
import {
  Restaurant,
  Review,
  ReviewComment,
  ReviewStatus,
  User,
} from "../../../types";

interface ReviewCommentsModalProps {
  review: Review;
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewComment: ReviewComment) => void;
}

const ReviewCommentsModal = (props: ReviewCommentsModalProps) => {
  const user: User = useContext(AuthContext);
  const { review, open, onClose = () => {}, onSubmit = () => {} } = props;
  const [reviewComment, setReviewComment] = useState<ReviewComment>({
    status: ReviewStatus.ACTIVE,
    comment: "",
    author: user,
  });

  const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setReviewComment((oldReview) => ({
      ...oldReview,
      comment: value,
    }));
  };

  return (
    <Dialog open={open} fullWidth maxWidth={"xs"}>
      <DialogContent>
        <Typography paragraph>{review.comment}</Typography>
        <TextField
          label={"Comment"}
          variant={"outlined"}
          multiline
          rows={5}
          rowsMax={5}
          fullWidth
          margin={"normal"}
          placeholder={"Add a comment"}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChangeComment}
          value={reviewComment.comment}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{"Cancel"}</Button>
        <Button
          disabled={!reviewComment.comment}
          color={"primary"}
          variant={"contained"}
          onClick={() => onSubmit(reviewComment)}
        >
          {"Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewCommentsModal;
