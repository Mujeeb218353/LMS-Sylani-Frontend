import { Link } from "react-router-dom";
import { GlobalContext } from "../context/AppContext";
import { useContext, useState } from "react";
import Alert from "../components/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ThemeProvider } from "@mui/material/styles";
import useMaterialUIThemeChanger from "../hooks/useMaterialUiTheme";
import ThemeChanger from "../components/ThemeChanger";

const Login = () => {
  const { theme, setLoginCredentials, role, setRole } =
    useContext(GlobalContext);
  const [showPass, setShowPass] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const materialUIThemeChanger = useMaterialUIThemeChanger();
  const handleLogin = async() => {
    setLoginCredentials({
      email,
      password,
    });
  };

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  return (
    <div
      data-theme={`${theme}`}
      className="min-h-screen flex justify-center items-center px-2"
    >
      <Alert />
      <div className="min-h-screen flex justify-center items-center">
        <section className="flex flex-col items-center justify-center">
          <div className="w-full bg-base-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border">
            <div className="p-4 space-y-4 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-center">
                Sign in to your account
              </h1>
              <div className="flex gap-y-5 flex-col">
                <label htmlFor="password" className="block text-sm font-medium">
                  Email
                </label>
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="input input-bordered w-full focus:outline-none"
                    placeholder="example@example.com"
                    required
                    onChange={(e) => {
                      e.preventDefault();
                      setEmail(e.target.value);
                    }}
                    value={email}
                  />
                </div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="join w-full">
                  <input
                    type={showPass}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full focus:outline-none join-item"
                    required
                    onChange={(e) => {
                      e.preventDefault();
                      setPassword(e.target.value);
                    }}
                    value={password}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPass(showPass === "text" ? "password" : "text")
                    }
                    className="btn btn-accent join-item"
                  >
                    {showPass !== "text" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.73 2.292-2.417 4.264-4.542 5.442M12 5v.01M12 19v.01M12 15.01l-.01-.01"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A9.963 9.963 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .57-1.789 1.5-3.356 2.667-4.642m1.647-1.662A9.963 9.963 0 0112 5c4.478 0 8.268 2.943 9.542 7-.733 2.297-2.424 4.27-4.542 5.447M3 3l18 18"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <ThemeProvider theme={materialUIThemeChanger}>
                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Role
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="role"
                      value={role}
                      onChange={handleRole}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      <FormControlLabel
                        value="student"
                        control={<Radio />}
                        label="Student"
                      />
                      <FormControlLabel
                        value="teacher"
                        control={<Radio />}
                        label="Teacher"
                      />
                      <FormControlLabel
                        value="admin"
                        control={<Radio />}
                        label="Admin"
                      />
                    </RadioGroup>
                  </FormControl>
                </ThemeProvider>
                <div className="flex items-center justify-between">
                  <Link
                    href="/forgotPassword"
                    className="text-sm font-medium link link-accent"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button className="btn btn-accent w-full" onClick={handleLogin}>
                  LOGIN
                </button>
                <div className="text-sm font-light text-center">
                  Don’t have an account yet?{" "}
                  <Link to="/signup" className="link link-accent font-medium">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <ThemeChanger/>
    </div>
  );
};

export default Login;
