import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export const GlobalContext = createContext();

const AppContext = ({ children }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("my-theme") || "light"
  );
  localStorage.setItem("my-theme", theme);
  const [alert, setAlert] = useState();
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");
  const [course, setCourse] = useState(null);
  const [cities, setCities] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentClass, setStudentClass] = useState("");
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [unSubmittedAssignments, setUnSubmittedAssignments] = useState([]);
  const [createdAssignments, setCreatedAssignments] = useState([]);
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
      if (localStorage.getItem("my-role") !== "admin") {
        localStorage.setItem("my-accessToken", response.data.data.accessToken);
        localStorage.setItem("my-role", role);
        setTimeout(() => {
          setAlert(null);
          navigate("/");
        }, 2000);
        await getUser();
      }
      setAlert({
        message: response.data.message || "Registration successful",
        type: "success",
      });
    } catch (error) {
      setAlert({
        message: error.response.data.message || "Registration failed",
        type: "error",
      });
      console.log(error);
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
      if (localStorage.getItem("my-role") === "admin") {
        getCity();
      }
      if (localStorage.getItem("my-role") === "student") {
        getStudentClass();
        getSubmittedAssignments();
        getUnSubmittedAssignments();
      }
      if (localStorage.getItem("my-role") === "teacher") {
        getCreatedAssignments();
      }
      setAlert({ message: "Logged In Successfully", type: "success" });
      setTimeout(() => {
        setAlert(null);
        navigate("/");
      }, 2000);
      await getUser();
    } catch (error) {
      setAlert({
        message: error.response.data.message || "Login failed",
        type: "error",
      });
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
      setTimeout(() => {
        setAlert(null);
        setUser(null);
        navigate("/login");
      }, 2000);
    } catch (error) {
      setAlert({
        message: error.response.data.message || "Logout failed",
        type: "error",
      });
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

  const getCity = async () => {
    if (localStorage.getItem("my-role") !== "admin") return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API}/admin/getCities`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setCities(response.data.data);
    } catch (error) {
      setAlert({ message: "Failed to fetch cities", type: "error" });
    }
  };

  const handleCityChange = async (selectedCity) => {
    if (selectedCity) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USERS_API}/admin/getCampuses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
            },
          }
        );
        setCampuses(response.data.data);
      } catch (error) {
        setAlert({ message: "Failed to fetch campuses", type: "error" });
        console.log(error);
      }
    } else {
      setCampuses([]);
    }
  };

  // const getCourse = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_USERS_API}/admin/getCourses`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
  //         },
  //       }
  //     );
  //     setCourses(response.data.data);
  //   } catch (error) {
  //     setAlert({ message: "Failed to fetch courses", type: "error" });
  //   }
  // };

  const handleCampusChange = async (selectedCampus) => {
    if (selectedCampus) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_USERS_API}/admin/getCourses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
            },
          }
        );
        setCourses(response.data.data);
      } catch (error) {
        setAlert({ message: "Failed to fetch courses", type: "error" });
      }
    } else {
      setCourses([]);
    }
  };

  const addCity = async ({ cityName, userId }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/admin/addCity`,
        {
          cityName,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setCities((prevCities) => [response.data.data, ...prevCities]);
      setAlert({
        message: response.data.message || "City Added Successfully",
        type: "success",
      });
    } catch (error) {
      setAlert({
        message: error.response.data.message || "Failed to Add City",
        type: "error",
      });
    }
  };

  const addCampus = async ({ name, cityId, userId }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/admin/addCampus`,
        {
          name,
          cityId,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setAlert({
        message: response.data.message || "Campus Added Successfully",
        type: "success",
      });
      setCampuses((prevCampuses) => [response.data.data, ...prevCampuses]);
    } catch (error) {
      setAlert({
        message: error.response.data.message || "Failed to Add Campus",
        type: "error",
      });
    }
  };

  const addCourse = async ({ name, cityId, campusId, userId }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/admin/addCourse`,
        {
          name,
          cityId,
          campusId,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setAlert({
        message: response.data.message || "Course Added Successfully",
        type: "success",
      });
      setCourses((prevCourses) => [response.data.data, ...prevCourses]);
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
    }
  };

  const handleCourseChange = async (selectedCourse) => {
    if (!selectedCourse) {
      setTeachers([]);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API}/admin/getTeachersByCourse?courseId=${
          selectedCourse._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setTeachers(response.data.data);
    } catch (error) {
      setAlert({
        message: error.response.data.message || "Failed to fetch teachers",
        type: "error",
      });
      console.log(error);
    }
  };

  const addClass = async ({
    name,
    enrollmentKey,
    batch,
    timing,
    teacherId,
    cityId,
    courseId,
    campusId,
    userId,
  }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/admin/addClass`,
        {
          name,
          enrollmentKey,
          batch,
          timing,
          teacherId,
          cityId,
          courseId,
          campusId,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setAlert({
        message: response.data.message || "Class Added Successfully",
        type: "success",
      });
      setClasses((prevClasses) => [response.data.data, ...prevClasses]);
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
    }
  };

  const handleEnrollInClass = async ({ enrollmentKey, studentId }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/student/enrollStudent`,
        {
          enrollmentKey,
          studentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setAlert({
        message: response.data.message || "Enrolled Successfully",
        type: "success",
      });
      setTimeout(() => {
        setAlert(null);
        window.location.reload();
      }, 3000);
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      console.log(error);
    }
  };

  const getStudentClass = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API}/student/getStudentClass`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setStudentClass(response.data.data[0]);
      // console.log(response);
    } catch (error) {
      setAlert({ message: "Please Login Again", type: "error" });
    }
  };

  const createAssignment = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/teacher/createAssignment`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setCreatedAssignments((prev) => [...prev, response.data.data]);
      setAlert({ message: response.data.message, type: "success" });
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
    }
  };

  const getSubmittedAssignments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API}/student/getSubmittedAssignment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setSubmittedAssignments(response.data.data);
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      console.log(error);
    }
  };

  const getUnSubmittedAssignments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API}/student/getUnSubmittedAssignment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setUnSubmittedAssignments(response.data.data);
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      console.log(error);
    }
  };

  const submitAssignment = async ({ link, assignmentId }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/student/submitAssignment`,
        {
          assignmentLink: link,
          assignmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setSubmittedAssignments((prev) => [...prev, response.data.data]);
      setAlert({ message: response.data.message, type: "success" });
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      console.log(error);
    }
  };

  const editSubmittedAssignment = async ({ assignmentId, assignmentLink }) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_USERS_API
        }/student/editSubmittedAssignment/${assignmentId}`,
        {
          assignmentLink,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setSubmittedAssignments((prevSubmittedAssignments) => {
        const updatedAssignments = prevSubmittedAssignments.map((assignment) =>
          assignment._id === response.data.data._id
            ? response.data.data
            : assignment
        );
        return updatedAssignments;
      });
      setAlert({ message: response.data.message, type: "success" });
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      console.log(error);
    }
  };

  const deleteSubmittedAssignment = async (assignmentId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_USERS_API
        }/student/deleteSubmittedAssignment/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setSubmittedAssignments((prevSubmittedAssignments) =>
        prevSubmittedAssignments.filter(
          (assignment) => assignment._id !== assignmentId
        )
      );
      setUnSubmittedAssignments((prev) => [...prev, response.data.data]);
      setAlert({ message: response.data.message, type: "success" });
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      console.log(error);
    }
  };

  const getCreatedAssignments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API}/teacher/getCreatedAssignments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setCreatedAssignments(response.data.data);
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Karachi",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };

  const editCreatedAssignment = async (data) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_USERS_API
        }/teacher/editAssignment/${data._id}`,
        {
          title: data.title,
          description: data.description,
          lastDate: data.lastDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setCreatedAssignments((prevCreatedAssignments) => {
        const updatedAssignments = prevCreatedAssignments.map((assignment) =>
          assignment._id === response.data.data._id
            ? response.data.data
            : assignment
        );
        return updatedAssignments;
      });
      setAlert({ message: response.data.message, type: "success" });
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
    }
  };

  const deleteCreatedAssignment = async (assignmentId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_USERS_API
        }/teacher/deleteAssignment/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setCreatedAssignments((prevCreatedAssignments) =>
        prevCreatedAssignments.filter(
          (assignment) => assignment._id !== assignmentId
        )
      );
      setAlert({ message: response.data.message, type: "success" });
    } catch (error) {
      setAlert({ message: error.response.data.message, type: "error" });
      console.log(error);
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
    if (localStorage.getItem("my-role") === "admin") {
      getCity();
    }
    if (
      localStorage.getItem("my-role") === "student" &&
      localStorage.getItem("my-accessToken")
    ) {
      getStudentClass();
      getSubmittedAssignments();
      getUnSubmittedAssignments();
    }
    if (
      localStorage.getItem("my-role") === "teacher" &&
      localStorage.getItem("my-accessToken")
    ) {
      getCreatedAssignments();
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
        loading,
        setLoading,
        cities,
        setCities,
        campuses,
        setCampuses,
        course,
        setCourse,
        courses,
        teachers,
        formatDate,
        createdAssignments,
        studentClass,
        submittedAssignments,
        setSubmittedAssignments,
        unSubmittedAssignments,
        setUnSubmittedAssignments,
        addCity,
        addCampus,
        addCourse,
        setCourses,
        registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken,
        handleCityChange,
        handleCampusChange,
        addClass,
        handleCourseChange,
        handleEnrollInClass,
        getStudentClass,
        createAssignment,
        submitAssignment,
        editSubmittedAssignment,
        deleteSubmittedAssignment,
        editCreatedAssignment,
        deleteCreatedAssignment,
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
