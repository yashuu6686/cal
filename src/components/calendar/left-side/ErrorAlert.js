
import React from "react";
import { Box, Typography } from "@mui/material";

const ErrorAlert = ({ error }) => {
  if (!error) return null;

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        bgcolor: "#ffebee",
        borderRadius: 2,
        border: "1px solid #ef5350",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography sx={{ color: "#c62828", fontWeight: 600, fontSize: "0.9rem" }}>
        ⚠️ {error}
      </Typography>
    </Box>
  );
};

export default ErrorAlert;