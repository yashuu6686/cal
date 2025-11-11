
import React from "react";
import { Formik, Form } from "formik";
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
import { addServiceSchema } from "@/components/calendar/validation/validation";

const AddServiceDialog = ({ open, onClose, onSubmit }) => {
  const initialValues = {
    name: "",
    duration: "",
    type: "",
  };

  const handleSubmit = async (values, formikBag) => {
    const result = await onSubmit(values, formikBag);
    if (result.success) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(25, 118, 210, 0.15)",
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={addServiceSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, values, handleChange, handleBlur }) => (
          <Form>
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
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  label="Service Name"
                  variant="outlined"
                  placeholder="Enter service name"
                />

                <TextField
                  select
                  name="duration"
                  label="Select Duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.duration && Boolean(errors.duration)}
                  helperText={touched.duration && errors.duration}
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
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.type && Boolean(errors.type)}
                  helperText={touched.type && errors.type}
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
                onClick={onClose}
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
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddServiceDialog;