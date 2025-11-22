import React, { useEffect } from "react";
import { Box, Typography, Button, ToggleButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getServiceMaster,
  selectServices,
  selectSelectedServices,
  toggleService, // ⭐ Import action
} from "@/redux/store/slices/calendarSlice";

import CommonButton from "@/components/CommonButton";
import SectionHeader from "@/components/SectionHeader";

const ServiceTypeSection = ({ disabled, onAddService }) => {
  const dispatch = useDispatch();

  // ⭐ Use selectors
  const services = useSelector(selectServices);
  const selectedServices = useSelector(selectSelectedServices);

  useEffect(() => {
    dispatch(getServiceMaster());
  }, [dispatch]);

  const handleToggle = (id) => {
    dispatch(toggleService(id));
  };

  return (
    <Box sx={{ mb: 2 }}>
      <SectionHeader
        title="Service Type"
        actionButton={
          <Button
            variant="contained"
            sx={{ textTransform: "none" }}
            disabled={disabled}
            onClick={onAddService}
          >
            Add Service
          </Button>
        }
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {services.map((item) => {
          const isActive = selectedServices.includes(item._id);

          return (
            <ToggleButton
              key={item._id}
              value={item._id}
              disabled={disabled}
              onClick={() => handleToggle(item._id)}
              selected={isActive}
              sx={{
                width: "105px",
                height: "65px",
                flexDirection: "column",
                borderRadius: "7px !important",
                textTransform: "none",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
                color: "#1172BA",
                border: isActive ? "2px solid #1565c0" : "1px solid #90caf9",
                backgroundColor: isActive ? "#e3f2fd" : "#fff",
                "&.Mui-selected": {
                  backgroundColor: "#e3f2fd",
                  border: "2px solid #1565c0",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: isActive ? "white" : "#1172BA",
                }}
              >
                {item.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.70rem",
                  color: isActive ? "white" : "#1172BA",
                }}
              >
                {item.duration} Minutes
              </Typography>
            </ToggleButton>
          );
        })}
      </Box>
    </Box>
  );
};

export default ServiceTypeSection;
