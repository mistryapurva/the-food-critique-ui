import * as React from "react";
import { User } from "../../types";

interface AuthContextType extends User {
  handleLogout: () => void;
}

const AuthContext = React.createContext<AuthContextType>(null);

export default AuthContext;
