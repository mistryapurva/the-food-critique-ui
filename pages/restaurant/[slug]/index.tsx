import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Grid,
  makeStyles,
  Snackbar,
  Theme,
  Typography,
} from "@material-ui/core";
import { Alert, Rating } from "@material-ui/lab";
import _filter from "lodash/filter";
import _first from "lodash/first";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _last from "lodash/last";
import _map from "lodash/map";
import _orderBy from "lodash/orderBy";
import _size from "lodash/size";
import moment from "moment";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { getRestaurant } from "../../../src/api/restaurants";
import { addReview } from "../../../src/api/reviews";
import ReviewCard from "../../../src/components/Card/Review";
import LoadingSpinner from "../../../src/components/LoadingSpinner";
import ReviewModal from "../../../src/components/Modal/Review";
import AuthContext from "../../../src/context/Auth";
import { Restaurant, Review, UserType } from "../../../src/types";

const useStyles = makeStyles((theme: Theme) => ({
  banner: {
    display: "flex",
    alignItems: "flex-start",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  bannerImage: {
    width: 250,
    height: 250,
    objectFit: "cover",
    borderRadius: 10,
    marginRight: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      height: 150,
      marginBottom: theme.spacing(2),
      marginRight: 0,
    },
  },
  ratingsContainer: {
    display: "flex",
    alignItems: "center",
  },
  avgRating: {
    marginLeft: theme.spacing(1),
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightMedium,
  },
  reviewsContainer: {
    marginTop: theme.spacing(3),
  },
  reviewsList: {
    marginTop: theme.spacing(2),
  },
  breadcrumbLink: {
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
}));

const RestaurantPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const user = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant>(null);
  const [reviews, setReviews] = useState([]);
  const [highestRatedReview, setHighestRatedReview] = useState(null);
  const [lowestRatedReview, setLowestRatedReview] = useState(null);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [router]);

  useEffect(() => {
    let reviews: Array<Review> = _get(restaurant, "reviews", []);
    if (_size(reviews) > 0) {
      reviews = _filter(reviews, (r) => !_isEmpty(r)).map((r) => ({
        ...r,
        updatedOn: moment(r.updatedOn).format("YYYYMMDDHHmmss"),
      }));
    }

    if (reviews.length > 2) {
      const reviewsOrderedByRating = _orderBy(reviews, ["rating"], ["desc"]);
      setHighestRatedReview(_first(reviewsOrderedByRating));
      setLowestRatedReview(_last(reviewsOrderedByRating));
    }

    setReviews(_orderBy(reviews, ["updatedOn"], ["desc"]));
  }, [restaurant]);

  const fetchRestaurantDetails = () => {
    const slug = _get(router, "query.slug");

    if (slug) {
      setLoading(true);
      getRestaurant(slug)
        .then((data) => {
          setRestaurant(data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSubmitReview = (review: Review) => {
    setShowReviewModal(false);
    setLoading(true);

    addReview(review)
      .then(() => {
        fetchRestaurantDetails();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>{`${_get(restaurant, "name", "")} | The Food Critique`}</title>
      </Head>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Breadcrumbs style={{ marginBottom: 16 }}>
            <NextLink href={"/"} as={"/"} passHref>
              <a className={classes.breadcrumbLink}>{"Restarants"}</a>
            </NextLink>
            <Typography>{_get(restaurant, "name")}</Typography>
          </Breadcrumbs>
          <Box className={classes.banner}>
            {_get(restaurant, "imageBase64") ? (
              <img
                src={_get(restaurant, "imageBase64")}
                className={classes.bannerImage}
              />
            ) : null}
            <Box>
              <Typography variant={"h3"} paragraph>
                {_get(restaurant, "name", "")}
              </Typography>
              <Typography paragraph>
                {_get(restaurant, "description")}
              </Typography>
              <Box className={classes.ratingsContainer}>
                <Rating
                  value={_get(restaurant, "avgRating")}
                  readOnly
                  precision={0.1}
                />
                <Typography className={classes.avgRating}>
                  {_get(restaurant, "avgRating")
                    ? restaurant.avgRating.toFixed(1)
                    : null}
                </Typography>
              </Box>
              <Typography>
                {_size(reviews) > 0
                  ? `${_size(reviews)} ratings`
                  : "No ratings yet"}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.reviewsContainer}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              marginBottom={1}
            >
              <Typography variant={"h5"}>{"Reviews"}</Typography>
              {user.role === UserType.USER ? (
                <Button
                  color={"primary"}
                  variant={"contained"}
                  onClick={() => setShowReviewModal(true)}
                >
                  {"Add Review"}
                </Button>
              ) : null}
            </Box>

            <Divider />
            <Grid container spacing={2} className={classes.reviewsList}>
              {!_isEmpty(highestRatedReview) ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant={"h6"}>{"Highest Rated"}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <ReviewCard
                      {...highestRatedReview}
                      restaurantProps={restaurant}
                    />
                  </Grid>
                </>
              ) : null}

              {!_isEmpty(lowestRatedReview) ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant={"h6"}>{"Lowest Rated"}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <ReviewCard
                      {...lowestRatedReview}
                      restaurantProps={restaurant}
                    />
                  </Grid>
                </>
              ) : null}

              {_size(reviews) > 0 ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant={"h6"}>{"All Reviews"}</Typography>
                  </Grid>
                  {_map(reviews, (review) => {
                    return !_isEmpty(review) ? (
                      <Grid item xs={12} key={_get(review, "_id")}>
                        <ReviewCard {...review} restaurantProps={restaurant} />
                      </Grid>
                    ) : null;
                  })}
                </>
              ) : (
                <Grid item xs={12}>
                  <Typography>
                    {"No reviews added yet. Be the first one to add a review."}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      )}

      {showReviewModal ? (
        <ReviewModal
          restaurant={restaurant}
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
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

export default RestaurantPage;
