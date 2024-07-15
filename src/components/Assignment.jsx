import { useContext, useState } from "react";
import { GlobalContext } from "../context/AppContext";
import SubmitAssignment from "./SubmitAssignment";

const Assignment = () => {
  const { submittedAssignments, unSubmittedAssignments } = useContext(GlobalContext);
  const [assignmentDetails, setAssignmentDetails] = useState({});

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <h1 className="text-3xl font-bold">Assignments</h1>
      
      <div className="w-full flex flex-col justify-center items-center gap-4">
        <h2 className="text-xl font-semibold">Submitted Assignments</h2>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr className="text-center">
                <th>Title</th>
                <th>Description</th>
                <th>Assigned Date</th>
                <th>Due Date</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {submittedAssignments && submittedAssignments.length > 0 ? (
                submittedAssignments.slice().reverse().map((assignment) => (
                  <tr key={assignment._id} className="text-center">
                    <td className="font-semibold">{assignment.title}</td>
                    <td>{assignment.description}</td>
                    <td>
                      {new Date(assignment.assignedDate).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(assignment.lastDate).toLocaleDateString()}
                    </td>
                    <td>
                      {assignment.marks || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No assignments available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-4 mt-8">
      <h2 className="text-xl font-semibold">Pending Assignments</h2>
      {unSubmittedAssignments && unSubmittedAssignments.length > 0 ? (
        unSubmittedAssignments.slice().reverse().map((assignment) => (
          <div
            key={assignment._id}
            className="w-full p-4 rounded-md shadow-xl mb-4 flex flex-row justify-between items-center gap-4"
          >
            <div>
              <h4 className="text-xl font-semibold">{assignment.title}</h4>
              <p>Description: {assignment.description}</p>
              <p>
                Assigned Date:{" "}
                {new Date(assignment.assignedDate).toLocaleDateString()}
              </p>
              <p>
                Due Date: {new Date(assignment.lastDate).toLocaleDateString()}
              </p>
            </div>
            <button
              className="btn btn-accent"
              disabled={Date.now() > new Date(assignment.lastDate).getTime()}
              onClick={() => {
                document.getElementById("my_modal_1").showModal();
                setAssignmentDetails({
                  _id: assignment._id,
                  title: assignment.title,
                  description: assignment.description,
                  assignedDate: assignment.assignedDate,
                  lastDate: assignment.lastDate,
                });
              }}
            >
              { Date.now() > new Date(assignment.lastDate).getTime()? "Assignment Due" : "Submit" }
            </button>
            <SubmitAssignment assignmentDetails={assignmentDetails} />
          </div>
        ))
      ) : (
        <p>No assignments available</p>
      )}
    </div>
    </div>
  );
};

export default Assignment;