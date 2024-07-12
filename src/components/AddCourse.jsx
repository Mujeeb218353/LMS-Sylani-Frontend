import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/AppContext";
import axios from "axios";
import { TextField, Autocomplete } from "@mui/material";

const AddCourse = () => {
  const { setAlert } = useContext(GlobalContext);
  const [course, setCourse] = useState("");
  const [city, setCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [campus, setCampus] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [loadingCampuses, setLoadingCampuses] = useState(false);

  useEffect(() => {
    getCity();
  }, []);

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

  const handleCityChange = async (selectedCity) => {
    setCity(selectedCity);
    if (selectedCity) {
      try {
        setLoadingCampuses(true);
        const response = await axios.get(
          `${import.meta.env.VITE_USERS_API}/admin/getCampuses?cityId=${selectedCity._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
            },
          }
        );
        setCampuses(response.data.data);
      } catch (error) {
        setAlert({ message: "Failed to fetch campuses", type: "error" });
      } finally {
        setLoadingCampuses(false);
      }
    } else {
      setCampuses([]);
    }
  };

  const handleAddCourse = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API}/admin/addCourse`,
        {
          name: course,
          cityId: city?._id,
          campusId: campus?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("my-accessToken")}`,
          },
        }
      );
      setAlert({ message: response.data.message, type: "success" });
      setCourse("");
      setCity(null);
      setCampus(null);
    } catch (error) {
      setAlert({ message: error.response.data.message || "Failed to add course", type: "error" });
    }
  };

  const isOptionEqualToValue = (option, value) => option._id === value._id;

  const getOptionLabel = (option) => {
    return option.cityName || "Unknown City";
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
        onChange={(event, value) => handleCityChange(value)}
        value={city}
      />
      <Autocomplete
        disablePortal
        id="campuses"
        options={campuses.filter((campus) => campus.city === city?._id)}
        getOptionLabel={(option) => option.name || "Unknown Campus"}
        isOptionEqualToValue={isOptionEqualToValue}
        loading={loadingCampuses}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label="Campus" />}
        onChange={(event, value) => setCampus(value)}
        value={campus}
      />
      <TextField
        id="courseName"
        label="Course Name"
        type="text"
        className="w-full"
        placeholder="Enter Course Name"
        onChange={(e) => setCourse(e.target.value)}
        value={course}
      />
      <button
        onClick={handleAddCourse}
        disabled={!course || !city || !campus}
        className="btn btn-accent w-1/2 mt-2"
      >
        ADD COURSE
      </button>
    </div>
  );
};

export default AddCourse;