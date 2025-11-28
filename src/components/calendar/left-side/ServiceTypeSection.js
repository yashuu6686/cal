import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getServiceMaster,
  selectServices,
  selectSelectedServices,
  toggleService,
  updateEvents,
  openAddServiceDialog,
  selectIsFieldsDisabled,
} from "@/redux/store/slices/calendarSlice";
import CommonDialogBox from "@/components/CommonDialogBox";
import CommonButton from "@/components/CommonButton";
import SectionHeader from "@/components/SectionHeader";
import AddServiceDialog from "./AddServiceDialog";

import { createSlice } from "@reduxjs/toolkit";
import video from "../../../../public/Video_Call_Service.png";
import clinic from "../../../../public/Clinic_Visit_Service.png";
import home from "../../../../public/Home_Visit_Service.webp";

import Image from "next/image";

const ServiceTypeSection = ({
  disabled,
  onAddService,
  days,
  slots,
  setSlots,
}) => {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [serviceToRemove, setServiceToRemove] = useState(null);
  const [clinicAddresses, setClinicAddresses] = useState([]);

  const dispatch = useDispatch();
  const isFieldsDisabled = useSelector(selectIsFieldsDisabled);

  const services = useSelector(selectServices);
  const selectedServices = useSelector(selectSelectedServices);
  const { events, addServiceDialogOpen } = useSelector(
    (state) => state.calendar
  );

  // Available addresses - you can fetch this from API or state
  const availableAddresses = [
    { id: 1, label: "-, Dhule, Maharashtra, India" },
    { id: 2, label: "new this, Surat, Gujarat, India" },
    { id: 3, label: "this data, Surat, Gujarat, India" },
    { id: 4, label: "-, Dhule, Maharashtra, India" },
    { id: 5, label: "It, Surat, Gujarat, India" },
  ];

  useEffect(() => {
    dispatch(getServiceMaster());
  }, [dispatch]);

  const clinicVisitCount = selectedServices.filter((serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    return service?.name?.toLowerCase().includes("clinic visit");
  }).length;

  useEffect(() => {
    if (clinicVisitCount > clinicAddresses.length) {
      setClinicAddresses((prev) => [
        ...prev,
        ...Array(clinicVisitCount - prev.length).fill(null),
      ]);
    } else if (clinicVisitCount < clinicAddresses.length) {
      setClinicAddresses((prev) => prev.slice(0, clinicVisitCount));
    }
  }, [clinicVisitCount]);

  const hasServiceSlots = (serviceId) => {
    return days.some((day) =>
      slots[day].some((slot) => slot.serviceType?.id === serviceId)
    );
  };

  const handleToggle = (id) => {
    const service = services.find((s) => s._id === id);
    const isCurrentlySelected = selectedServices.includes(id);

    if (isCurrentlySelected && hasServiceSlots(service._id)) {
      setServiceToRemove({ id, name: service.name });
      setShowRemoveDialog(true);
    } else {
      dispatch(toggleService(id));
    }
  };

  const confirmRemove = () => {
    if (!serviceToRemove) return;

    const updatedSlots = { ...slots };
    days.forEach((day) => {
      updatedSlots[day] = updatedSlots[day].filter(
        (slot) => slot.serviceType?.id !== serviceToRemove.id
      );
    });
    setSlots(updatedSlots);

    const updatedEvents = events.filter((event) => {
      return (
        event.id !== serviceToRemove.id &&
        event._id !== serviceToRemove.id &&
        event.serviceId !== serviceToRemove.id
      );
    });

    dispatch(updateEvents(updatedEvents));
    dispatch(toggleService(serviceToRemove.id));

    setShowRemoveDialog(false);
    setServiceToRemove(null);
  };

  const cancelRemove = () => {
    setShowRemoveDialog(false);
    setServiceToRemove(null);
  };

  const handleAddressChange = (index, newValue) => {
    const updatedAddresses = [...clinicAddresses];
    updatedAddresses[index] = newValue;
    setClinicAddresses(updatedAddresses);
  };

  const getServiceImage = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes("video")) return video;
    if (name.includes("clinic")) return clinic;
    if (name.includes("home")) return home;
    return null; // Fallback if no match
  };

  return (
    <Box sx={{}}>
      <SectionHeader
        title="Service Type"
        actionButton={
          <Button
            variant="contained"
            sx={{ textTransform: "none" }}
            disabled={isFieldsDisabled}
            onClick={() => dispatch(openAddServiceDialog(true))}
          >
            Add Service
          </Button>
        }
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.9, }}>
        {services.map((item) => {
          const isActive = selectedServices.includes(item._id);
          const serviceImage = getServiceImage(item.name);

          return (
            <ToggleButton
              key={item._id}
              value={item._id}
              disabled={isFieldsDisabled}
              onClick={() => handleToggle(item._id)}
              selected={isActive}
              sx={{
                ml:"2px",
                width: "105px",
                height: "68px",
                flexDirection: "column",
                borderRadius: "7px !important",
                textTransform: "none",
                border: "1px solid #1565c0",
                justifyContent: "center",
                backgroundColor: isActive
                  ? "#1565c0"
                  : isFieldsDisabled
                  ? ""
                  : "#fff",

                cursor: isFieldsDisabled ? "not-allowed" : "pointer",

                "& .service-text": {
                  color: isActive
                    ? "white"
                    : isFieldsDisabled
                    ? "#b5b5b5"
                    : "#1172BA",
                },

                "& .duration-text": {
                  color: isActive
                    ? "white"
                    : isFieldsDisabled
                    ? "#b5b5b5"
                    : "#1172BA",
                },

                "&:hover": {
                  backgroundColor: isActive
                    ? "#1565c0"
                    : !isFieldsDisabled
                    ? "#e3f2fd"
                    : "#f1f1f1",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/*ye ha dyanamic karana he */}
                {serviceImage && (
                  <Image
                    src={serviceImage}
                    alt={item.name}
                    width={29}
                    height={29}
                    style={{
                      marginTop: "3px",
                      objectFit: "contain",
                      filter: isActive ? "brightness(0) invert(1)" : "none",
                    }}
                  />
                )}
                <Typography
                  className="service-text"
                  sx={{
                    "&.Mui-disabled": {
                      // backgroundColor: "#eaeaea",
                      color: "gray !important",
                    },
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: isActive ? "white" : "#1172BA",
                  }}
                >
                  {item.name}
                </Typography>

                <Typography
                  className="duration-text"
                  sx={{
                    fontSize: "0.70rem",
                    color: isActive ? "white" : "#1172BA",
                  }}
                >
                  {item.duration} Minutes
                </Typography>
              </Box>
            </ToggleButton>
          );
        })}
      </Box>

      {clinicVisitCount > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 0.5, fontWeight: 400, color: "gray" }}
          >
            Select Address for Clinic Visit
          </Typography>

          <Box sx={{}}>
            {Array.from({ length: clinicVisitCount }).map((_, index) => (
              <Autocomplete
                disable
                size="small"
                fullWidth
                key={index}
                options={availableAddresses}
                value={clinicAddresses[index]}
                onChange={(event, newValue) =>
                  handleAddressChange(index, newValue)
                }
                disabled={isFieldsDisabled}
                getOptionLabel={(option) => option?.label || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Select address"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <CommonDialogBox
        open={showRemoveDialog}
        onClose={cancelRemove}
        onConfirm={confirmRemove}
        title="Remove Time Slots"
        message={`The service you deselected has associated time slots. Do you want to remove the time slots for this service?`}
        confirmText="Remove"
        cancelText="Cancel"
      />
      <AddServiceDialog />
    </Box>
  );
};

export default ServiceTypeSection;
