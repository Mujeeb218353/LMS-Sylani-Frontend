import { useState, useContext } from 'react';
import { GlobalContext } from '../context/AppContext';
import TextField from '@mui/material/TextField';

const AddAssignment = () => {
  const { createAssignment } = useContext(GlobalContext);
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    lastDate: '',
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
    console.log('Assignment:', assignment);

    createAssignment(assignment).then(() => {
      setAssignment({
        title: '',
        description: '',
        lastDate: '',
      });
    })
  };

  return (
    <div className='flex flex-col justify-center items-center gap-4 w-full sm:3/4 md:w-1/2 m-auto'>
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
        <button className='btn btn-accent w-1/2 mt-2' onClick={handleSubmit}>
          Add Assignment
        </button> 
    </div>
  );
};

export default AddAssignment;