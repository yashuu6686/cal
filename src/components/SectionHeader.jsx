import React from "react";
import { Box, Typography, Button } from "@mui/material";


export default function SectionHeader({ title, actionButton }) {
  return (
    <Box
      sx={{
        background: "rgb(198, 228, 251)",
        p: 0.6,
        borderRadius: 3,
        border: "1px solid #90caf9",
        mb: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: 400 }}>
        {title}
      </Typography>
      {actionButton}
    </Box>
  );
}

// Usage example:
// <SectionHeader 
//   title="Service Type" 
//   actionButton={
//     <Button variant="contained" onClick={onAddService}>
//       Add Service
//     </Button>
//   }
// />