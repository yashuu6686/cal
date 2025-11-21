import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { 
  getServiceMaster,
  selectServices,
  selectSelectedServices,
  toggleService // ⭐ Import action
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
    dispatch(toggleService(id)); // ⭐ Dispatch action
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

      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {services.map((item) => {
          const isActive = selectedServices.includes(item._id);

          return (
            <CommonButton
              key={item._id}
              disabled={disabled}
              src={item.img}
              onClick={() => handleToggle(item._id)}
              isSelected={isActive}
              sx={{
                border: isActive ? "2px solid #2e7d32" : "1px solid #bdbdbd",
                backgroundColor: isActive ? "#e8f5e9" : "#fff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {item.name}
              </Typography>

              <Typography sx={{ fontSize: "0.70rem", textTransform: "none" }}>
                {item.duration} Minutes
              </Typography>
            </CommonButton>
          );
        })}
      </Box>
    </Box>
  );
};

export default ServiceTypeSection;