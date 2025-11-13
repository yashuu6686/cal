import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleService,
  removeSlotsByServiceType,
  updateEvents,
} from "@/redux/store/slices/calendarSlice";
import { useCalendarState } from "@/hook/useCalendarState";
import CommonButton from "@/components/CommonButton";
import CommonDialogBox from "@/components/CommonDialogBox";

const ServiceTypeSection = ({ disabled, onAddService }) => {
  const dispatch = useDispatch();
  const { dataOfService, selectedServices } = useCalendarState();
  const weekSchedule = useSelector((state) => state.calendar.weekSchedule);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [serviceToRemove, setServiceToRemove] = useState(null);


  const hasAssociatedSlots = (serviceType) => {
    return weekSchedule.some((day) =>
      day.slots.some((slot) => slot.serviceType === serviceType)
    );
  };

  const handleToggleService = (service) => {
    const isCurrentlySelected = selectedServices.some(
      (s) => s.type === service.type
    );

    if (isCurrentlySelected && hasAssociatedSlots(service.type)) {
      setServiceToRemove(service);
      setOpenConfirmDialog(true);
    } else {
      dispatch(toggleService(service));
    }
  };

  const handleConfirmRemoveSlots = () => {
    if (serviceToRemove) {
      dispatch(removeSlotsByServiceType(serviceToRemove.type));
      dispatch(updateEvents());

      dispatch(toggleService(serviceToRemove));

      setOpenConfirmDialog(false);
      setServiceToRemove(null);
    }
  };

  const handleCancelRemoveSlots = () => {
    // User cancelled, don't deselect the service
    setOpenConfirmDialog(false);
    setServiceToRemove(null);
  };

  return (
    <Box sx={{ mb: 2 }}>
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
              onClick={() => handleToggleService(item)}
            >
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {item.type}
              </Typography>
              <Typography sx={{ fontSize: "0.70rem", textTransform: "none" }}>
                {item.time} Minutes
              </Typography>
            </CommonButton>
          );
        })}
      </Box>

      {/* Confirmation Dialog */}
      <CommonDialogBox
        open={openConfirmDialog}
        onClose={handleCancelRemoveSlots}
        onConfirm={handleConfirmRemoveSlots}
        title="Remove Time Slots"
        message={`The service you deselected has associated time slots. Do you want to remove the time slots for this service?`}
        confirmText="Remove"
        cancelText="Cancel"
        // confirmColor="error"
        hideCancel={false}
      />
    </Box>
  );
};

export default ServiceTypeSection;
