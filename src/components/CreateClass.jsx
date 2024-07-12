import { ThemeProvider } from "@mui/material/styles";
import useMaterialUIThemeChanger from "../hooks/useMaterialUiTheme";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";

const CreateClass = () => {
  const [className, setClassName] = useState("");
  const [enrollmentKey, setEnrollmentKey] = useState("");
  const [teacher, setTeacher] = useState("");
  const [course, setCourse] = useState("");
  const [city, setCity] = useState("");
  const [campus, setCampus] = useState("");
  const [batch, setBatch] = useState("");
  const [timing, setTiming] = useState("");

  const isOptionEqualToValue = (option, value) => {
    return option.id === value.id;
  };

  return (
    <ThemeProvider theme={useMaterialUIThemeChanger()}>
      <div className="w-full">
        <div className="flex flex-col justify-center items-center gap-4 w-full sm:3/4 md:w-1/2 m-auto">
          <TextField
            id="class-name"
            label="Class Name"
            type="text"
            className="w-full"
            placeholder="Enter Class Name"
            onChange={(e) => setClassName(e.target.value)}
            value={className}
          />
          <TextField
            id="enrollment-key"
            label="Enrollment Key"
            type="text"
            className="w-full"
            placeholder="abc123"
            onChange={(e) => setEnrollmentKey(e.target.value)}
            value={enrollmentKey}
          />
          <TextField
            id="batch"
            label="Batch"
            type="text"
            className="w-full"
            placeholder="Enter Batch"
            onChange={(e) => setBatch(e.target.value)}
            value={batch}
          />
          <TextField
            id="timings"
            label="Timings"
            type="text"
            className="w-full"
            placeholder="Enter Timings"
            onChange={(e) => setTiming(e.target.value)}
            value={timing}
          />
          <Autocomplete
            disablePortal
            id="course"
            options={["Web Development", "Data Science", "Cyber Security"]}
            isOptionEqualToValue={isOptionEqualToValue}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Course" />}
            onChange={(event, value) => setCourse(value)}
            value={course}
          />
          <Autocomplete
            disablePortal
            id="teacher"
            options={["John", "Jane", "Joe"]}
            isOptionEqualToValue={isOptionEqualToValue}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Teacher" />}
            onChange={(event, value) => setTeacher(value)}
            value={teacher}
          />
          <Autocomplete
            disablePortal
            id="city"
            options={["Karachi", "Lahore", "Islamabad"]}
            isOptionEqualToValue={isOptionEqualToValue}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="City" />}
            onChange={(event, value) => setCity(value)}
            value={city}
          />
          <Autocomplete
            disablePortal
            id="campus"
            options={["Gulshan", "Head Office"]}
            isOptionEqualToValue={isOptionEqualToValue}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} label="Campus" />}
            onChange={(event, value) => setCampus(value)}
            value={campus}
          />
          <button className="btn btn-accent w-1/2 mt-2" onClick={() => {}}>
            Create Class
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CreateClass;
