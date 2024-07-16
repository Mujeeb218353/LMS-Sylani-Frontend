import { useState, useContext } from "react";
import { GlobalContext } from "../context/AppContext";
import TextField from "@mui/material/TextField";

const AddAssignment = () => {
  const { createAssignment, createdAssignments } = useContext(GlobalContext);
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    lastDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment({
      ...assignment,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Assignment:", assignment);

    createAssignment(assignment).then(() => {
      setAssignment({
        title: "",
        description: "",
        lastDate: "",
      });
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full sm:3/4 md:w-1/2 m-auto">
      <button
        className="btn btn-accent"
        onClick={() => document.getElementById("create-assignment").showModal()}
      >
        Create Assignment
      </button>
      <dialog id="create-assignment" className="modal">
        <div className="modal-box flex flex-col justify-center items-center gap-4">
          <h1 className="text-3xl font-bold">Create Assignment</h1>
          <TextField
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            value={assignment.title}
            onChange={handleChange}
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={assignment.description}
            onChange={handleChange}
          />
          <TextField
            id="lastDate"
            name="lastDate"
            label="Due Date"
            type="date"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={assignment.lastDate}
            onChange={handleChange}
          />
          <div className="flex items-center justify-end gap-4 w-full">
            <button
              className="btn"
              onClick={() =>
                document.getElementById("create-assignment").close()
              }
            >
              Cancel
            </button>
            <button className="btn btn-accent w-1/2" onClick={handleSubmit}>
              Create
            </button>
          </div>
        </div>
      </dialog>
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <h1 className="text-3xl font-bold">Assignments</h1>
        {createdAssignments && createdAssignments.length > 0 ? (
          createdAssignments.map((assignment) => (
            <div tabIndex={0} className="collapse collapse-arrow shadow-lg" key={assignment._id}>
              <input type="checkbox"/>
              <div className="collapse-title flex justify-between w-full">
                <div className="text-xl font-medium">
                  {assignment.title}
                </div>
                <div className="z-10 w-auto flex gap-2">
                  <button
                    className="btn btn-success btn-outline"
                    onClick={() => {
                      document
                        .getElementById("submit-assignment-modal")
                        .showModal();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-outline"
                    onClick={() => {
                      document
                        .getElementById("submit-assignment-modal")
                        .showModal();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="collapse-content">
                <p>hello</p>
              </div>
            </div>
          ))
        ) : (
          <p>No assignments found</p>
        )}
      </div>
    </div>
  );
};

export default AddAssignment;
