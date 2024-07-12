import { GlobalContext } from "../context/AppContext";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";

const AddCity = () => {
  const { setAlert } = useContext(GlobalContext);
  const [cityName, setCityName] = useState("");

  const handleAddCity = async () => {
    if (cityName === "") {
      setAlert({ message: "City is required", type: "error" });
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/${localStorage.getItem("my-role")}/addCity`,
        {cityName},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      )
      setAlert({ message: response.data.data.message || "City added successfully", type: "success" });
      setCityName("");
    } catch (error) {
      setAlert({ message: error.response.data.message || "Failed to add city", type: "error" });
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full sm:3/4 md:w-1/2 m-auto">
      <TextField
        id="city"
        label="City"
        type="text"
        className="w-full"
        placeholder="Enter City"
        onChange={(e) => setCityName(e.target.value)}
        value={cityName}
      />
      <button className="btn btn-accent w-1/2 mt-2" onClick={handleAddCity} disabled={!cityName}>ADD CITY</button>
    </div>
  );
};

export default AddCity;
