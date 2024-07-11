import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import { useGlobalContext } from "../context/GlobalContext"; // Assuming you have a global context for API calls

const AddAssignment = () => {
//   const { addAssignment } = useGlobalContext(); // Replace with your actual context API hook

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [deployLink, setDeployLink] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Depending on the type of user (coder or graphics designer), handle data accordingly
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      
      if (repoLink) {
        formData.append("repoLink", repoLink);
      }
      
      if (deployLink) {
        formData.append("deployLink", deployLink);
      }
      
      if (file) {
        formData.append("file", file);
      }

    //   await addAssignment(formData);

      // Clear form after successful submission
      setTitle("");
      setDescription("");
      setRepoLink("");
      setDeployLink("");
      setFile(null);

      // Optionally show a success message
    } catch (error) {
      console.error("Error adding assignment:", error.message);
      // Handle error
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="title"
          label="Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="description"
          label="Description"
          fullWidth
          multiline
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          id="repoLink"
          label="Repository Link"
          fullWidth
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
        />
        <TextField
          id="deployLink"
          label="Deployment Link"
          fullWidth
          value={deployLink}
          onChange={(e) => setDeployLink(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <label htmlFor="file" className="cursor-pointer">
            <CloudUploadIcon />
            <span>Upload File</span>
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && <span>{file.name}</span>}
        </div>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AddAssignment;