import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, Box, Typography, Snackbar } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import * as toxicity from '@tensorflow-models/toxicity';

const threshold = 0.9;

export default function TaskForm({ onAdd }) {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(null);
  const [model, setModel] = useState(null);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);  

  useEffect(() => {
    // Load the toxicity model
    toxicity.load(threshold).then(mod => {
      console.log('Toxicity model loaded');
      setModel(mod);
    }).catch(err => {
      console.error('Failed to load the toxicity model', err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (model) {
      try {
        // Analyze the sentiment of the task
        const predictions = await model.classify([task]);
        console.log('Predictions:', predictions);
        const toxic = predictions.some(prediction => prediction.results.some(res => res.match));

        if (toxic) {
          setError('Task contains negative sentiment. Please revise.');
          setSnackbarOpen(true);
          return;
        }
      } catch (err) {
        console.error('Failed to classify the task', err);
        setError('Error classifying the task. Please try again.');
        setSnackbarOpen(true);
        return;
      }
    }

    // If not toxic, add the task
    const newTask = {
      task,
      priority,
      dueDate,
    };
    onAdd(newTask);
    setTask('');
    setPriority('Medium');
    setDueDate(null);
    setError('');
  };

const handleCloseSnackbar = () => {
  setSnackbarOpen(false);
};

return (
  <>
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          label="New Task"
          variant="outlined"
          fullWidth
          value={task}
          onChange={(e) => setTask(e.target.value)}
          error={Boolean(error)}
          helperText={error}
        />
      </Box>
      <Box mb={2}>
        <Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </Box>
      <Box mb={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>
      <Button type="submit" variant="contained" color="primary">
        Add
      </Button>
    </form>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      message={error}
    />
  </>
);
}