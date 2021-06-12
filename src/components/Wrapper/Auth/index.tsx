import React, { ReactNode, useEffect, useState } from "react";
import { getMyUser } from "../../../api/user";
import AuthContext from "../../../context/Auth";
import LoadingSpinner from "../../LoadingSpinner";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import Header from "../../Header";
import { User, UserType } from "../../../types";
import { initAxios } from "../../../api";
import LoginForm, { LoginData } from "../../Form/Login";
import SignUpForm, { SignUpData } from "../../Form/SignUp";
import { loginUser, signUpUser } from "../../../api/auth";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = (props: AuthWrapperProps) => {
  const { children } = props;
  const router = useRouter();

  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    initAxios(token, handleLogout);
    if (!token || !userId) {
      setLoading(false);
    } else {
      setLoading(true);
      getMyUser(userId)
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          setError(String(error));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const handleLogin = (loginData: LoginData) => {
    setLoading(true);
    loginUser(loginData.email, loginData.password)
      .then((user) => {
        const token = _get(user, "token");
        const userId = _get(user, "_id");

        if (token && userId) {
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          setUser(user);
          initAxios(token, handleLogout);
        }
      })
      .catch((error) => {
        setError(String(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSignUp = (signUpData: SignUpData) => {
    setLoading(true);
    signUpUser(
      signUpData.email,
      signUpData.password,
      signUpData.name,
      signUpData.role
    )
      .then(() => {
        handleLogin({ email: signUpData.email, password: signUpData.password });
      })
      .catch((error) => {
        setError(String(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    initAxios("", handleLogout);
    setUser(null);
    router.push("/", "/");
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : !_isEmpty(user) ? (
        <AuthContext.Provider
          value={{
            ...user,
            handleLogout,
          }}
        >
          <Header />
          {children}
        </AuthContext.Provider>
      ) : showSignUp ? (
        <SignUpForm
          onLogin={() => setShowSignUp(false)}
          onSignUp={handleSignUp}
        />
      ) : (
        <LoginForm onLogin={handleLogin} onSignUp={() => setShowSignUp(true)} />
      )}

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

export default AuthWrapper;
