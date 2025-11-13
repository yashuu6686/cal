
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingOverlay = ({ isLoading, isPublished }) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} sx={{ color: "#fff", mb: 2 }} />
      {/* <Typography sx={{ color: "#fff", fontSize: "1.2rem", fontWeight: 600 }}>
        {isPublished ? "🔄 Updating Calendar..." : "📅 Publishing Calendar..."}
      </Typography> */}
    </Box>
  );
};

export default LoadingOverlay;
