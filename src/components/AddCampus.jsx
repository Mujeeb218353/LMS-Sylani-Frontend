import { Autocomplete, TextField } from "@mui/material";
import { GlobalContext } from "../context/AppContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

const AddCampus = () => {
  const { setAlert } = useContext(GlobalContext);
  const [city, setCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [campus, setCampus] = useState("");

  const getCity = async () => {
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

  useEffect(() => {
    getCity();
  }, []);

  const isOptionEqualToValue = (option, value) => option._id === value?._id;

  const getOptionLabel = (option) => {
    return option.cityName || "Unknown City";
  };

  const handleAddCampus = async () => {

    if (!city) {
      setAlert({ message: "City is required", type: "error" });
      return;
    }

    if (!campus) {
      setAlert({ message: "Campus is required", type: "error" });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/admin/addCampus`,
        {
          name: campus,
          cityId: city._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setAlert({ message: response.data.message, type: "success" });
      setCampus("");
      setCity(null);
    } catch (error) {
      setAlert({ message: error.response?.data?.message || "Failed to add campus", type: "error" });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full sm:3/4 md:w-1/2 m-auto">
      <Autocomplete
        disablePortal
        id="cities"
        options={cities}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label="City" />}
        onChange={(event, value) => setCity(value)}
        value={city}
      />
      <TextField
        id="campus"
        label="Campus"
        type="text"
        className="w-full"
        placeholder="Enter Campus"
        onChange={(e) => setCampus(e.target.value)}
        value={campus}
      />
      <button className="btn btn-accent w-1/2 mt-2" onClick={handleAddCampus}  disabled={ !city || !campus}>ADD CAMPUS</button>
    </div>
  );
};

export default AddCampus;