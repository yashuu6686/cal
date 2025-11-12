import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleService } from "@/redux/store/slices/calendarSlice";
import { useCalendarState } from "@/hook/useCalendarState";
import CommonButton from "@/components/CommonButton";
// import { sectionHeaderStyles } from "./styles";

const ServiceTypeSection = ({ disabled, onAddService }) => {
  const dispatch = useDispatch();
  const { dataOfService, selectedServices } = useCalendarState();

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
        //   ...sectionHeaderStyles,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "10px",
           background: "rgb(198, 228, 251)",
            p: 1,
            borderRadius: 3,
            border: "1px solid #90caf9",
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: 400 }}>
          Service Type
        </Typography>
        <Button
          disabled={disabled}
          variant="contained"
          onClick={onAddService}
          sx={{
            textTransform: "none",
            background: "#1172BA",
            color: "white",
            fontWeight: 600,
            fontSize: "0.9rem",
            px: 1,
          }}
        >
          Add Service
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {dataOfService.map((item, i) => {
          const isSelected = selectedServices.some((s) => s.type === item.type);
          return (
            <CommonButton
              disabled={disabled}
              key={i}
              src={item.img}
              isSelected={isSelected}
              onClick={() => dispatch(toggleService(item))}
            >
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600,textTransform:'none' }}>
                {item.type}
              </Typography>
              <Typography sx={{ fontSize: "0.70rem",textTransform:'none' }}>
                {item.time} Minutes
              </Typography>
            </CommonButton>
          );
        })}
      </Box>
    </Box>
  );
};

export default ServiceTypeSection;