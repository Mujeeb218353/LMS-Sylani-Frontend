import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export const GlobalContext = createContext();

const AppContext = ({ children }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("my-theme") || "light"
  );
  localStorage.setItem("my-theme", theme);
  const [alert, setAlert] = useState();
  const [loginCredentials, setLoginCredentials] = useState({});
  const [user, setUser] = useState({});
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("my-theme", theme);
  }, [theme]);

  const registerUser = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/student/register`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      localStorage.setItem("my-accessToken", response.data.data.accessToken);
      Cookies.set('refreshToken', response.data.refreshToken, { secure: true, httpOnly: true });
      setAlert({ message: "Registration successful", type: "success" });
      await getUser();
      navigate("/");
    } catch (error) {
      setAlert({
        message: error.response.data.message || "Registration failed",
        type: "error",
      });
    }
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/${role}/login`,
        loginCredentials,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("my-accessToken", response.data.data.accessToken);
      // localStorage.setItem("my-refreshToken", response.data.data.refreshToken);
      setAlert({ message: "Logged In Successfully", type: "success" });
      await getUser();
      navigate("/");
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
    }
  };

  const getUser = async () => {
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
      setAlert({ message: error.response.data.message, type: "error" });
    }
  };

  const logoutUser = async () => {
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
      // localStorage.removeItem("my-refreshToken");
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

  const getMyUser = async () => {
    await getUser();
  };

  useEffect(() => {
    if (Object.keys(loginCredentials).length > 0) {
      loginUser();
    }
  }, [loginCredentials]);

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
      getMyUser();
    } else {
      setAlert({
        message: "Please login to continue",
        type: "warning",
      })
      navigate("/login");
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        setTheme,
        loginCredentials,
        setLoginCredentials,
        alert,
        setAlert,
        user,
        setUser,
        role,
        setRole,
        registerUser,
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
