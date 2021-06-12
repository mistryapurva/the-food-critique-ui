import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  ListSubheader,
  makeStyles,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import _get from "lodash/get";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/Auth";
import { ASSETS } from "../../theme/assets";
import { UserType } from "../../types";
import { getInitialsFromName } from "../../utils";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const TABS = {
  restaurants: 0,
  reviews: 1,
  users: 2,
};

const Header = () => {
  const classes = useStyles();
  const { handleLogout, ...user } = useContext(AuthContext);
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.restaurants);

  const userAvatarRef = useRef(null);

  useEffect(() => {
    const { asPath } = router;

    if (asPath === "/reviews") {
      setActiveTab(TABS.reviews);
    } else if (asPath === "/users") {
      setActiveTab(TABS.users);
    } else {
      setActiveTab(TABS.restaurants);
    }
  }, [router]);

  return (
    <>
      <AppBar position={"fixed"} color={"default"}>
        <Toolbar>
          <Container maxWidth={"md"} className={classes.container}>
            <NextLink href={"/"} as={"/"} passHref>
              <a>
                <img src={ASSETS.logoSmall} height={40} />
              </a>
            </NextLink>
            {user.role === UserType.ADMIN ? (
              <Box flex={1} style={{ overflow: "hidden" }}>
                <Container>
                  <Tabs value={activeTab} centered variant={"scrollable"}>
                    <Tab
                      label={"Restaurants"}
                      value={TABS.restaurants}
                      onClick={() => {
                        router.push("/", "/");
                      }}
                    />
                    <Tab
                      label={"Reviews"}
                      value={TABS.reviews}
                      onClick={() => {
                        router.push("/reviews", "/reviews");
                      }}
                    />
                    <Tab
                      label={"Users"}
                      value={TABS.users}
                      onClick={() => {
                        router.push("/users", "/users");
                      }}
                    />
                  </Tabs>
                </Container>
              </Box>
            ) : null}
            <IconButton
              ref={userAvatarRef}
              onClick={() => setShowUserMenu(true)}
              size={"small"}
            >
              <Avatar className={classes.avatar}>
                {getInitialsFromName(_get(user, "name"))}
              </Avatar>
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>
      <Toolbar></Toolbar>
      <Menu
        open={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        anchorEl={_get(userAvatarRef, "current")}
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
        <ListSubheader>{user.name}</ListSubheader>
        <MenuItem onClick={handleLogout}>{"Logout"}</MenuItem>
      </Menu>
    </>
  );
};

export default Header;
