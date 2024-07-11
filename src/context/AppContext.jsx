import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export const GlobalContext = createContext();

const AppContext = ({ children }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("my-theme") || "light"
  );
  localStorage.setItem("my-theme", theme);
  const [alert, setAlert] = useState();
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("my-theme", theme);
  }, [theme]);

  const registerUser = async ({ data, role }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/${role}/register`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if(localStorage.getItem("my-role") !== "admin"){
        localStorage.setItem("my-accessToken", response.data.data.accessToken);
        localStorage.setItem("my-role", role);
        navigate("/");
        await getUser();
      }
      setAlert({ message: response.data.message || "Registration successful", type: "success" });
    } catch (error) {
      setAlert({
        message: "Registration failed",
        type: "error",
      });
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/${role}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("my-accessToken", response.data.data.accessToken);
      localStorage.setItem("my-role", role);
      setAlert({ message: "Logged In Successfully", type: "success" });
      await getUser();
      navigate("/");
    } catch (error) {
      setAlert({ message: "Login failed", type: "error" });
    }
  };

  const getUser = async () => {
    const role = localStorage.getItem("my-role");
    try {
      const user = await axios.get(
        `${import.meta.env.VITE_USERS_API}/${role}/getCurrent${
          role[0].toLocaleUpperCase() + role.slice(1)
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setUser(user.data.data);
    } catch (error) {
      setAlert({ message: "Please Login Again", type: "error" });
      localStorage.removeItem("my-accessToken");
      localStorage.removeItem("my-role");
    }
  };

  const logoutUser = async () => {
    const role = localStorage.getItem("my-role");
    try {
      await axios.post(
        `${import.meta.env.VITE_USERS_API}/${role}/logout`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setAlert({ message: "Logged Out Successfully", type: "success" });
      localStorage.removeItem("my-accessToken");
      localStorage.removeItem("my-role");
      setUser(null);
      navigate("/login");
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
    }
  };
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/${role}/refresh${
          role[0].toLocaleUpperCase() + role.slice(1)
        }AccessToken`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
          withCredentials: true,
        }
      );
      localStorage.setItem("my-accessToken", response.data.data.accessToken);
      setAlert({ message: response.data.message, type: "success" });
      setLoading(false);
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("my-accessToken");
    if (!accessToken) {
      return;
    }
    const { exp } = jwtDecode(accessToken);
    const expirationTime = exp * 1000;

    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    const refreshTimeout = timeUntilExpiration - 5 * 60 * 1000;
    if (refreshTimeout > 0) {
      setTimeout(refreshAccessToken, refreshTimeout);
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        setTheme,
        alert,
        setAlert,
        user,
        setUser,
        role,
        setRole,
        registerUser,
        loginUser,
        logoutUser,
        loading,
        refreshAccessToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

AppContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContext;
