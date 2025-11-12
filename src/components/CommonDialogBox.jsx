import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function CommonDialogBox({
  open,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary", // primary | error | success | warning | info
  hideCancel = false, // New prop to hide cancel button
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          padding: "6px",
          minWidth: "400px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "18px",
          fontWeight: 600,
          color: "white",
          alignItems: "center",
          bgcolor: "rgb(17, 114, 186)",
          borderRadius: "10px",
          p: 1,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Typography
          sx={{ fontSize: "15px", color: "#4b5563", lineHeight: 1.6 }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions >
        {!hideCancel && (
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              // px: 2,
            }}
          >
            {cancelText}
          </Button>
        )}

        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            // px: 3,
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
