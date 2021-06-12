import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { getReviews, updateReview } from "../src/api/reviews";
import LoadingSpinner from "../src/components/LoadingSpinner";
import AuthContext from "../src/context/Auth";
import { Review, ReviewStatus, UserType } from "../src/types";
import _map from "lodash/map";
import _get from "lodash/get";
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
import ReviewCard from "../src/components/Card/Review";
import moment from "moment";
import _isEmpty from "lodash/isEmpty";
import EditReviewModal from "../src/components/Modal/EditReview";
import _cloneDeep from "lodash/cloneDeep";
import Head from "next/head";
import { Alert } from "@material-ui/lab";

const Reviews = () => {
  const user = useContext(AuthContext);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Array<Review>>([]);
  const [reviewToEdit, setReviewToEdit] = useState<Review>(null);
  const [reviewToDelete, setReviewToDelete] = useState<Review>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user.role !== UserType.ADMIN) {
      router.replace("/", "/");
      return;
    } else {
      fetchReviews();
    }
  }, []);

  const fetchReviews = () => {
    setLoading(true);
    getReviews()
      .then((data) => {
        const reviewsWithDate = _map(data, (r) => {
          return {
            ...r,
            updatedOn: moment(r.updatedOn).format("YYYYMMDDHHmmss"),
          };
        });
        setReviews(reviewsWithDate);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmitReview = (review: Review) => {
    setLoading(true);
    setReviewToEdit(null);
    setReviewToDelete(null);
    updateReview(review)
      .then(() => {
        setReviews([]);
        fetchReviews();
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>{"The Food Critique | Reviews"}</title>
      </Head>
      {loading ? <LoadingSpinner /> : null}
      <Grid container spacing={2}>
        {_map(reviews, (review) => {
          return (
            <Grid item xs={12} key={review._id}>
              <ReviewCard
                {...review}
                restaurantProps={review.restaurant}
                onEdit={() => setReviewToEdit(review)}
                onDelete={() =>
                  setReviewToDelete({
                    ...review,
                    status: ReviewStatus.INACTIVE,
                  })
                }
                onActivate={() => {
                  handleSubmitReview({
                    ...review,
                    status: ReviewStatus.ACTIVE,
                  });
                }}
              />
            </Grid>
          );
        })}
      </Grid>
      {!_isEmpty(reviewToEdit) ? (
        <EditReviewModal
          open={!_isEmpty(reviewToEdit)}
          review={reviewToEdit}
          onCancel={() => setReviewToEdit(null)}
          onSubmit={handleSubmitReview}
        />
      ) : null}

      {!_isEmpty(reviewToDelete) ? (
        <Dialog open={!_isEmpty(reviewToDelete)}>
          <DialogTitle>{"Delete Review"}</DialogTitle>
          <DialogContent>
            <DialogContentText>{`The selected review will be marked as Inactive. Are you sure?`}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewToDelete(null)}>{"Cancel"}</Button>
            <Button
              onClick={() => {
                handleSubmitReview(reviewToDelete);
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

export default Reviews;
