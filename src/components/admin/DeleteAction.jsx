import React from 'react';
import { ListItemIcon, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteAction = ({ handleDelete, row, deleteType }) => {
  return (
    <MenuItem
      key="delete"
      onClick={() =>
        handleDelete(
          [row.original._id],
          deleteType === "RESTORE" ? "RESTORE" : deleteType
        )
      }
    >
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      {deleteType === "RESTORE" ? "Restore" : "Delete"}
    </MenuItem>
  );
};

export default DeleteAction;
