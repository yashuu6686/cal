import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  
  removeSlotsByServiceType,
  updateEvents,
} from "@/redux/store/slices/calendarSlice";
import {toggleService,} from "@/redux/store/slices/uiSlice"

import { useCalendarState } from "@/hook/useCalendarState";
import CommonButton from "@/components/CommonButton";
import CommonDialogBox from "@/components/CommonDialogBox";
import SectionHeader from "@/components/SectionHeader";

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
