import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeAddServiceDialog } from "@/redux/store/slices/calendarSlice";

const AddServiceDialog = ({ onSave }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.calendar.addServiceDialogOpen);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    type: "",
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        duration: "",
        type: "",
      });
    }
  }, [open]);

  const handleClose = () => {
    dispatch(closeAddServiceDialog());
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("📌 Saved Data:", formData);
    console.log("Service Name:", formData.name);
    console.log("Duration:", formData.duration);
    console.log("Type:", formData.type);

    // Parent ko data send karna (agar onSave prop pass kiya hai)
    if (onSave) {
      onSave(formData);
    }

    dispatch(closeAddServiceDialog());
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(25, 118, 210, 0.15)",
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
          p: 2,
        }}
      >
        <DialogTitle sx={{ p: 0, fontSize: "1.5rem", fontWeight: 600 }}>
          Add Service
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            label="Service Name"
            variant="outlined"
            placeholder="Enter service name"
            fullWidth
          />

          <TextField
            select
            name="duration"
            label="Select Duration"
            value={formData.duration}
            onChange={handleChange}
            fullWidth
          >
            {[15, 30, 45, 60, 90].map((min) => (
              <MenuItem key={min} value={min}>
                {min} minutes
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            name="type"
            label="Service Type"
            value={formData.type}
            onChange={handleChange}
            fullWidth
          >
            {["Home Visit", "Video Call", "Clinic Visit"].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #e0e0e0",
          p: 2,
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            color: "#1976d2",
            fontWeight: 500,
            textTransform: "none",
            px: 3,
            border: "1px solid #1976d2",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;