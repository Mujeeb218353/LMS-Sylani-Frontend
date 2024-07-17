import { useContext, useState } from "react";
import { GlobalContext } from "../context/AppContext";
import SubmitAssignment from "./SubmitAssignment";
import EditSubmittedAssignment from "./EditSubmittedAssignment";

const Assignment = () => {
  const { submittedAssignments, unSubmittedAssignments, user, deleteSubmittedAssignment, formatDate } =
    useContext(GlobalContext);
  const [assignmentId, setAssignmentId] = useState(null);
  const [assignmentLink, setAssignmentLink] = useState("");

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">

      <div className="w-full flex flex-col justify-center items-center gap-4">
        <h2 className="text-xl font-semibold">Submissions</h2>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr className="text-center">
                <th>Title</th>
                <th>Assignment Link</th>
                <th>Submission Date</th>
                <th>Due Date</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedAssignments && submittedAssignments.length > 0 ? (
                submittedAssignments.map((assignment) => (
                  <tr key={assignment._id} className="text-center">
                    <td className="font-semibold">{assignment.title}</td>
                    <td>
                      {assignment.submittedBy &&
                        assignment.submittedBy
                          .filter(
                            (student) =>
                              student.studentId.toString() ===
                              user._id.toString()
                          )
                          .map((student) => (
                            <a
                              key={student._id}
                              href={student.link}
                              target="_blank"
                            >
                              {student.link}
                            </a>
                          ))}
                    </td>

                    <td>
                      {formatDate(assignment.submittedBy && assignment.submittedBy
                              .filter(student => student.studentId.toString() === user._id.toString())
                              .map(student => student.submissionDate))}
                    </td>
                    <td>
                      {formatDate(assignment.lastDate)}
                    </td>
                    <td>{assignment.marks || 0}</td>
                    <td className="flex gap-2 justify-center items-center py-12 lg:py-4">
                      <button
                        className="btn btn-success btn-outline"
                        disabled={
                          Date.now() > new Date(assignment.lastDate).getTime()
                        }
                        onClick={() => {
                          setAssignmentLink(
                            assignment.submittedBy && assignment.submittedBy
                              .filter(student => student.studentId.toString() === user._id.toString())
                              .map(student => student.link)
                          );
                          setAssignmentId(assignment._id);
                          document
                            .getElementById("edit-assignment-modal")
                            .showModal();
                        }}
                      >
                        Edit
                      </button>
                      <EditSubmittedAssignment
                        assignmentId={assignmentId}
                        assignmentLink={assignmentLink}
                        setAssignmentLink={setAssignmentLink}
                      />
                      <button
                        className="btn btn-error btn-outline"
                        disabled={
                          Date.now() > new Date(assignment.lastDate).getTime()
                        }
                        onClick={() => deleteSubmittedAssignment(assignment._id)}
                      >
                        Delete
                      </button>
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
        <h2 className="text-xl font-semibold">Pending Submissions</h2>
        {unSubmittedAssignments && unSubmittedAssignments.length > 0 ? (
          unSubmittedAssignments
            .slice()
            .reverse()
            .map((assignment) => (
              <div
                key={assignment._id}
                className="w-full p-4 rounded-md shadow-xl mb-4 flex flex-row justify-between items-center gap-4"
              >
                <div>
                  <h4 className="text-xl font-semibold">{assignment.title}</h4>
                  <p>Description: {assignment.description}</p>
                  <p>
                    Assigned Date:{" "}
                    {formatDate(assignment.assignedDate)}
                  </p>
                  <p>
                    Due Date:{" "}
                    {formatDate(assignment.lastDate)}
                  </p>
                </div>
                <button
                  className="btn btn-accent"
                  disabled={
                    Date.now() > new Date(assignment.lastDate)
                  }
                  onClick={() => {
                    document
                      .getElementById("submit-assignment-modal")
                      .showModal();
                    setAssignmentId(assignment._id);
                  }}
                >
                  {Date.now() > new Date(assignment.lastDate)
                    ? "Due"
                    : "Submit"}
                </button>
                <SubmitAssignment assignmentId={assignmentId} />
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