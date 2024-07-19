import { useState, useContext } from "react";
import { GlobalContext } from "../context/AppContext";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

const AddAssignment = () => {
  const {
    createAssignment,
    createdAssignments,
    setAlert,
    formatDate,
    editCreatedAssignment,
    deleteCreatedAssignment,
    setAssignmentId,
  } = useContext(GlobalContext);
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    lastDate: "",
  });

  const [editAssignment, setEditAssignment] = useState({
    _id: "",
    title: "",
    description: "",
    lastDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!assignment.title) {
      setAlert({ message: "Title is required", type: "error" });
      return;
    }

    if (!assignment.description) {
      setAlert({ message: "Description is required", type: "error" });
      return;
    }

    if (!assignment.lastDate) {
      setAlert({ message: "Last Date is required", type: "error" });
      return;
    }

    if (new Date(assignment.lastDate) <= new Date()) {
      setAlert({
        message: "Last Date cannot be in the past or current date",
        type: "error",
      });
      return;
    }

    document.getElementById("create-assignment").close();

    createAssignment({
      title: assignment.title,
      description: assignment.description,
      lastDate: `${assignment.lastDate} 23:59:59.999`,
    }).then(() => {
      setAssignment({
        _id: "",
        title: "",
        description: "",
        lastDate: "",
      });
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!editAssignment.title) {
      setAlert({ message: "Title is required", type: "error" });
      return;
    }

    if (!editAssignment.description) {
      setAlert({ message: "Description is required", type: "error" });
      return;
    }

    if (!editAssignment.lastDate) {
      setAlert({ message: "Last Date is required", type: "error" });
      return;
    }

    if (new Date(editAssignment.lastDate) <= new Date()) {
      setAlert({
        message: "Last Date cannot be in the past or current date",
        type: "error",
      });
      return;
    }

    document.getElementById("edit-assignment").close();

    editCreatedAssignment({
      _id: editAssignment._id,
      title: editAssignment.title,
      description: editAssignment.description,
      lastDate: editAssignment.lastDate.includes("T") ? editAssignment.lastDate : `${editAssignment.lastDate} 23:59:59.999`,
    }).then(() => {
      setEditAssignment({
        _id: "",
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
          <h1 className="text-xl font-bold">Create Assignment</h1>
          <TextField
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            value={assignment.title}
            onChange={(e) =>
              setAssignment({ ...assignment, title: e.target.value })
            }
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
            onChange={(e) =>
              setAssignment({ ...assignment, description: e.target.value })
            }
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
            onChange={(e) =>
              setAssignment({ ...assignment, lastDate: e.target.value })
            }
          />
          <div className="flex items-center justify-end gap-4 w-full">
            <button
              className="btn"
              onClick={() => {
                document.getElementById("create-assignment").close();
                setAssignment({
                  title: "",
                  description: "",
                  lastDate: "",
                });
              }}
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
          createdAssignments
            .slice()
            .reverse()
            .map((assignment) => (
              <div
                className="card bg-base-100 shadow-xl w-full"
                key={assignment._id}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl font-bold">
                    {assignment.title}
                  </h2>
                  <p>
                    <b>Description: </b>
                    {assignment.description}
                  </p>
                  <p>
                    <b>Assign Date: </b>
                    {formatDate(assignment.assignedDate)}
                  </p>
                  <p>
                    <b>Due Date: </b>
                    {formatDate(assignment.lastDate)}
                  </p>
                  <div className="card-actions">
                    <Link
                      to={`/${assignment._id}`}
                      className="btn btn-info btn-outline"
                      onClick={() => {
                        setAlert(null)
                        setAssignmentId(assignment._id);
                      }}
                    >
                      Details
                    </Link>
                    <button
                      className="btn btn-success btn-outline"
                      onClick={() => {
                        document.getElementById("edit-assignment").showModal();
                        setEditAssignment(assignment);
                      }}
                    >
                      Edit
                    </button>
                    <dialog id="edit-assignment" className="modal">
                      <div className="modal-box flex flex-col justify-center items-center gap-4">
                        <h1 className="text-xl font-bold">Update Assignment</h1>
                        <TextField
                          id="title"
                          name="title"
                          label="Title"
                          variant="outlined"
                          fullWidth
                          value={editAssignment.title}
                          onChange={(e) =>
                            setEditAssignment({
                              ...editAssignment,
                              title: e.target.value,
                            })
                          }
                        />
                        <TextField
                          id="description"
                          name="description"
                          label="Description"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                          value={editAssignment.description}
                          onChange={(e) => {
                            setEditAssignment({
                              ...editAssignment,
                              description: e.target.value,
                            });
                          }}
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
                          value={
                            editAssignment.lastDate
                              ? editAssignment.lastDate.split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            setEditAssignment({
                              ...editAssignment,
                              lastDate: e.target.value.split("T")[0],
                            });
                          }}
                        />
                        <div className="flex items-center justify-end gap-4 w-full">
                          <button
                            className="btn"
                            onClick={() => {
                              document
                                .getElementById("edit-assignment")
                                .close();
                              setEditAssignment({
                                _id: "",
                                title: "",
                                description: "",
                                lastDate: "",
                              });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-accent w-1/2"
                            onClick={(e) => {
                              setEditAssignment({
                                ...editAssignment,
                                _id: assignment._id,
                              });
                              handleEditSubmit(e);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </dialog>
                    <button
                      className="btn btn-error btn-outline"
                      onClick={() => {
                        deleteCreatedAssignment(assignment._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
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
