import React from "react";
import { Box, IconButton } from "@mui/material";
import { Edit, Delete, Check, Close } from "@mui/icons-material";


export const EditDeleteButtons = ({ onEdit, onDelete }) => (
  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
    <IconButton color="primary" size="small" onClick={onEdit}>
      <Edit fontSize="small" />
    </IconButton>
    <IconButton color="error" size="small" onClick={onDelete}>
      <Delete fontSize="small" />
    </IconButton>
  </Box>
);


export const SaveCancelButtons = ({ onSave, onCancel }) => (
  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
    <IconButton
      size="small"
      onClick={onSave}
      sx={{
        color: "white",
        bgcolor: "#4caf50",
        "&:hover": { bgcolor: "#45a049" },
      }}
    >
      <Check fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={onCancel}
      sx={{
        color: "white",
        bgcolor: "#f44336",
        "&:hover": { bgcolor: "#da190b" },
      }}
    >
      <Close fontSize="small" />
    </IconButton>
  </Box>
);

export const TableActionButtons = ({
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}) => {
  return isEditing ? (
    <SaveCancelButtons onSave={onSave} onCancel={onCancel} />
  ) : (
    <EditDeleteButtons onEdit={onEdit} onDelete={onDelete} />
  );
};

// Usage in tables:
// <TableCell align="center" sx={{ py: 1.5 }}>
//   <TableActionButtons
//     isEditing={editingIndex === index}
//     onEdit={() => handleStartEdit(index, item)}
//     onDelete={() => handleDelete(index)}
//     onSave={handleSave}
//     onCancel={handleCancel}
//   />
// </TableCell>