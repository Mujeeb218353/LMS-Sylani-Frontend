import { useState, useContext } from "react";
import { GlobalContext } from "../context/AppContext";
import TextField from "@mui/material/TextField";

const EnrollInClass = () => {
  const { handleEnrollInClass, user, setAlert } = useContext(GlobalContext);
  const [enrollmentKey, setEnrollmentKey] = useState("");

  const handleEnroll = () => {
    if (!enrollmentKey) {
      setAlert({ message: "Enrollment Key is required", type: "error" });
      return;
    }
    handleEnrollInClass({ enrollmentKey, studentId: user._id }).then(() => {
      setEnrollmentKey("");
    })
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full sm:3/4 md:w-1/2 m-auto h-96">
      <h1 className="text-3xl font-bold">Enroll in Class</h1>
      <TextField
        id="enrollmentKey"
        label="Enrollment Key"
        type="text"
        className="w-full"
        placeholder="abc123"
        onChange={(e) => setEnrollmentKey(e.target.value)}
        value={enrollmentKey}
      />
      <button className="btn btn-accent w-1/2 mt-2" onClick={handleEnroll}>
        Enroll
      </button>
    </div>
  );
};

export default EnrollInClass;
