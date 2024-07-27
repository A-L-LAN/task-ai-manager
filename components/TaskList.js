import React from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TaskList({ tasks, onDelete }) {
  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id} divider>
          <Box flexGrow={1}>
            <ListItemText 
              primary={task.task}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    Priority: {task.priority}
                  </Typography>
                  {" - "}
                  <Typography component="span" variant="body2" color="textSecondary">
                    Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"}
                  </Typography>
                </>
              }
            />
          </Box>
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}

