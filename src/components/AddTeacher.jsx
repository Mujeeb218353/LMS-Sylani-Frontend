import { GlobalContext } from "../context/AppContext";
import { useContext, useState } from "react";
import Alert from "../components/Alert";
import { ThemeProvider } from "@mui/material/styles";
import useMaterialUIThemeChanger from "../hooks/useMaterialUiTheme";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const AddTeacher = () => {
  const { theme, setAlert, registerUser } = useContext(GlobalContext);
  const materialUIThemeChanger = useMaterialUIThemeChanger();
  const [course, setCourse] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState("");

  const isOptionEqualToValue = (option, value) => {
    return option.id === value.id;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!course) {
      setAlert({
        message: "Course is required",
        type: "error",
      });
      return;
    }

    if (!fullName) {
      setAlert({
        message: "Full Name is required",
        type: "error",
      });
      return;
    }

    if (!email) {
      setAlert({
        message: "Email is required",
        type: "error",
      });
      return;
    }

    if (!phoneNumber) {
      setAlert({
        message: "Phone Number is required",
        type: "error",
      });
      return;
    }

    if (!gender) {
      setAlert({
        message: "Gender is required",
        type: "error",
      });
      return;
    }

    if (!password) {
      setAlert({
        message: "Password is required",
        type: "error",
      });
      return;
    }

    if (!confirmPassword) {
      setAlert({
        message: "Confirm Password is required",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setAlert({
        message:
          "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number and one special character",
        type: "error",
      });
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        confirmPassword
      )
    ) {
      setAlert({
        message:
          "Confirm Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number and one special character",
        type: "error",
      });
      return;
    }

    const data = new FormData();
    data.append("profile", profile);
    data.append("course", course);
    data.append("fullName", fullName);
    data.append("email", email);
    data.append("phoneNumber", phoneNumber);
    data.append("gender", gender);
    data.append("password", password);
    data.append("role", "teacher");

    registerUser({data, role: "teacher"});
  };
  return (
    <div
      className="p-4 flex flex-col justify-center items-center"
      data-theme={`${theme}`}
    >
      <Alert />
      <form
        className="lg:w-9/12 sm:w-11/12 space-y-4 md:space-y-6"
        onSubmit={handleRegister}
      >
        <ThemeProvider theme={materialUIThemeChanger}>
          <div className="pt-2 space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <TextField
                id="name"
                label="Name"
                type="text"
                className="w-full"
                placeholder="Your Name"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                className="w-full"
                placeholder="example123@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <TextField
                id="phoneNumber"
                label="Phone Number"
                type="number"
                className="w-full"
                placeholder="921234567890"
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
              />
              <Autocomplete
                disablePortal
                id="gender"
                options={["Male", "Female", "Other"]}
                isOptionEqualToValue={isOptionEqualToValue}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Gender" />
                )}
                onChange={(event, value) => setGender(value)}
                value={gender}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <TextField
                id="password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Your Password"
                className="w-full"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <TextField
                id="confirmed-password-input"
                label="Confirm Password"
                type="password"
                autoComplete="current-password"
                placeholder="Confirm Your Password"
                className="w-full"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Autocomplete
                disablePortal
                id="course"
                options={[
                  "Web and Mobile Application Development (Hybrid)",
                  "Data Science",
                  "Cyber Security",
                  "Artificial Intelligence",
                ]}
                isOptionEqualToValue={isOptionEqualToValue}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Course" />
                )}
                onChange={(event, value) => setCourse(value)}
                value={course}
              />
              <input
                type="file"
                className="file-input file-input-bordered w-full focus:outline-blue-500 h-[3.5rem]"
                onChange={(e) => setProfile(e.target.files[0])}
              />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <button className="btn btn-accent w-1/2" type="submit">
                ADD TEACHER
              </button>
            </div>
          </div>
        </ThemeProvider>
      </form>
    </div>
  );
};

export default AddTeacher;
