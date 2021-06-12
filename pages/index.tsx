import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  Snackbar,
  Theme,
  Typography,
} from "@material-ui/core";
import _get from "lodash/get";
import _map from "lodash/map";
import _size from "lodash/size";
import _isEmpty from "lodash/isEmpty";
import _filter from "lodash/filter";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  createRestaurant,
  getRestaurants,
  updateRestaurant,
} from "../src/api/restaurants";
import RestaurantCard from "../src/components/Card/Restaurant";
import RatingFilter from "../src/components/Filter/Rating";
import LoadingSpinner from "../src/components/LoadingSpinner";
import RestaurantModal from "../src/components/Modal/Restaurant";
import AuthContext from "../src/context/Auth";
import {
  RatingFilterEnum,
  Restaurant,
  RestaurantStatus,
  UserType,
} from "../src/types";
import { Alert } from "@material-ui/lab";

export interface RestaurantFilters {
  rating: RatingFilterEnum;
}

const useStyles = makeStyles((theme: Theme) => ({
  filterBar: {
    display: "flex",
    alignItems: "flex-end",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const router = useRouter();
  const user = useContext(AuthContext);

  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [restaurantFilters, setRestaurantFilters] = useState<RestaurantFilters>(
    {
      rating: "0",
    }
  );
  const [error, setError] = useState(null);
  const [restaurantToEdit, setRestaurantToEdit] = useState<Restaurant>(null);
  const [restaurantToDelete, setRestaurantToDelete] =
    useState<Restaurant>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    fetchRestaurants(null, restaurantFilters.rating, 0);
  }, [restaurantFilters]);

  const fetchRestaurants = (
    search?: string,
    rating?: RatingFilterEnum,
    skip?: number
  ) => {
    setLoading(true);
    getRestaurants({ search, skip, rating })
      .then((data: any) => {
        setRestaurants(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
        setFirstLoadComplete(true);
      });
  };

  const handleCreateRestaurant = (restaurant: Restaurant) => {
    setShowRestaurantModal(false);
    setLoading(true);
    createRestaurant(restaurant)
      .then(fetchRestaurants)
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateRestaurant = (restaurant: Restaurant) => {
    setShowRestaurantModal(false);
    setLoading(true);
    setRestaurantToDelete(null);
    setRestaurantToEdit(null);
    updateRestaurant(restaurant)
      .then((updatedRestaurant) => {
        const newRestaurants = _map(restaurants, (r) => {
          if (_get(r, "_id") === _get(updatedRestaurant, "_id")) {
            return updatedRestaurant;
          }

          return r;
        }).filter((r) => _get(r, "status") === RestaurantStatus.ACTIVE);

        setRestaurants(newRestaurants);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeFilters = (field: string, value: any) => {
    setRestaurantFilters({
      ...restaurantFilters,
      [field]: value,
    });
  };

  return (
    <>
      {loading ? <LoadingSpinner /> : null}
      {firstLoadComplete ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className={classes.filterBar}>
              <Chip label={"Filters"} style={{ marginRight: 16 }} />
              <RatingFilter
                onChange={(value: RatingFilterEnum) => {
                  handleChangeFilters("rating", value);
                }}
              />
              <Box flex={1}></Box>
              {user.role === UserType.OWNER ? (
                <Button
                  color={"primary"}
                  variant={"contained"}
                  onClick={() => setShowRestaurantModal(true)}
                >
                  {"ADD RESTAURANT"}
                </Button>
              ) : null}
            </Box>
          </Grid>
          {!loading ? (
            _size(restaurants) > 0 ? (
              _map(restaurants, (restaurant) => {
                return (
                  <Grid
                    item
                    key={_get(restaurant, "_id")}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <RestaurantCard
                      {...restaurant}
                      onClick={() => {
                        router.push(
                          "/restaurant/[slug]",
                          `/restaurant/${restaurant._id}`
                        );
                      }}
                      onEdit={() => {
                        setRestaurantToEdit(restaurant);
                        setShowRestaurantModal(true);
                      }}
                      onDelete={() => {
                        setRestaurantToDelete({
                          ...restaurant,
                          status: RestaurantStatus.INACTIVE,
                        });
                      }}
                      onActivate={() => {
                        handleUpdateRestaurant({
                          ...restaurant,
                          status: RestaurantStatus.ACTIVE,
                        });
                      }}
                    />
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Typography align={"center"}>
                  {"No restaurants yet."}
                </Typography>
              </Grid>
            )
          ) : null}
        </Grid>
      ) : null}

      {showRestaurantModal ? (
        <RestaurantModal
          restaurantToEdit={restaurantToEdit}
          open={showRestaurantModal}
          onClose={() => setShowRestaurantModal(false)}
          onSubmit={(restaurant: Restaurant) => {
            if (!_isEmpty(restaurantToEdit)) {
              handleUpdateRestaurant(restaurant);
            } else {
              handleCreateRestaurant(restaurant);
            }
          }}
        />
      ) : null}

      {!_isEmpty(restaurantToDelete) ? (
        <Dialog open={!_isEmpty(restaurantToDelete)}>
          <DialogTitle>{"Delete Restaurant?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`${_get(restaurantToDelete, "name", "")} will be ${
                user.role === UserType.OWNER ? "deleted" : "marked as Inactive"
              }. Are you sure?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRestaurantToDelete(null)}>
              {"Cancel"}
            </Button>
            <Button
              color={"secondary"}
              variant={"contained"}
              onClick={() => {
                handleUpdateRestaurant(restaurantToDelete);
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

export default Home;
