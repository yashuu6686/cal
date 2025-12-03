import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import SectionHeader from "@/components/SectionHeader";
import { getSpecialtyMaster, selectIsFieldsDisabled } from "@/redux/store/slices/calendarSlice";
import { advanceBookingSchema } from "../validation/validation";

import tooth from "../../../../public/tooth 1.png";
import gen from "../../../../public/General.png";
import nuro from "../../../../public/Neurologist.png";
import ortho from "../../../../public/Orthopaedic.png";
import cardio from "../../../../public/cardiology.png";
import Image from "next/image";

const SpecialitiesSection = ({
  disabled,
  setSelectedSpecialties,
  selectedSpecialties,
  advanceBooking,
  setAdvanceBooking,
}) => {
  const dispatch = useDispatch();
  const { specialties } = useSelector((state) => state.calendar);
  const { calendar } = useSelector((state) => state.calendar);

  const isFieldsDisabled = useSelector(selectIsFieldsDisabled);
  
  

  const [advanceBookingErrors, setAdvanceBookingErrors] = useState({});

  useEffect(() => {
    dispatch(getSpecialtyMaster());
  }, [dispatch]);

  useEffect(() => {
    if (!calendar?.specialties || !specialties.length) return;

    const activeSpecialtyIds = [];

    if (Array.isArray(calendar.specialties)) {
      calendar.specialties.forEach((specialtyId) => {
        if (typeof specialtyId === "string") {
          activeSpecialtyIds.push(specialtyId);
        } else if (specialtyId._id) {
          activeSpecialtyIds.push(specialtyId._id);
        } else if (specialtyId.id) {
          activeSpecialtyIds.push(specialtyId.id);
        } else if (specialtyId.name) {
          const matchingSpecialty = specialties.find(
            (s) => s.name === specialtyId.name
          );
          if (matchingSpecialty) {
            activeSpecialtyIds.push(matchingSpecialty._id);
          }
        }
      });
    }

    setSelectedSpecialties(activeSpecialtyIds);
  }, [calendar, specialties]);

  useEffect(() => {
    const validate = async () => {
      try {
        await advanceBookingSchema.validate(advanceBooking, {
          abortEarly: false,
        });
        setAdvanceBookingErrors({}); // clear errors
      } catch (err) {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setAdvanceBookingErrors(errors);
      }
    };

    validate();
  }, [advanceBooking]);

  const handleToggle = (id) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getServiceImage = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes("dental")) return tooth;
    if (name.includes("gen")) return gen;
    if (name.includes("ne")) return nuro;
    if (name.includes("ortho")) return ortho;
    if (name.includes("cardio")) return cardio;
    return null; // Fallback if no match
  };

  return (
    <Box sx={{ mb: 2 }}>
      <SectionHeader title="Specialities" />

      <Box sx={{ display: "flex", flexWrap: "wrap",  gap: "2px", }}>
        {specialties.map((item) => {
          const isActive = selectedSpecialties.includes(item._id);
          const serviceImage = getServiceImage(item.name);

          return (
            <ToggleButton
              key={item._id}
              disabled={isFieldsDisabled}
              src={item.img}
              onClick={() => handleToggle(item._id)}
              selected={isActive}
              sx={{
                 ml:"2px",
                width: "105px",
                height: "65px",
                flexDirection: "column",
                borderRadius: "7px !important",
                textTransform: "none",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
                 border: "1px solid #1565c0",
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
                {/*ye ha dyanamic karana he direct image url insert karva ni che */}
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
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textTransform: "none",
                    color: isActive ? "white" : "#1172BA",
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            </ToggleButton>
          );
        })}
      </Box>
      <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />
      <Box sx={{ mt: 1 }}>
        <SectionHeader title="Advance Booking" />
        <Box sx={{ my: 1, display: "flex", gap: 1 }}>
          <TextField
            size="small"
            label="Advance Booking Days"
            
            // type="number"
            value={advanceBooking.advanceBookingDays}
            onChange={(e) => {
              let value = Number(e.target.value);

              if (value > 99) value = 99;

              setAdvanceBooking((prev) => ({
                ...prev,
                advanceBookingDays: value,
              }));
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            disabled={isFieldsDisabled}
            sx={{ flex: 1 }}
            error={Boolean(advanceBookingErrors.advanceBookingDays)}
            helperText={advanceBookingErrors.advanceBookingDays}
          />
          <TextField
            size="small"
            label="Check-in Time (minutes)"
            // type="number"
            value={advanceBooking.checkInTime}
            onChange={(e) => {
              let value = Number(e.target.value);

              if (value > 99) value = 99; 

              setAdvanceBooking((prev) => ({ ...prev, checkInTime: value }));
            }}
            disabled={isFieldsDisabled}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            sx={{ flex: 1 }}
            error={Boolean(advanceBookingErrors.checkInTime)}
            helperText={advanceBookingErrors.checkInTime}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SpecialitiesSection;
