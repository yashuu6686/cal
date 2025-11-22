import React, { useEffect, useState } from "react";
import { Box, ToggleButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import CommonButton from "@/components/CommonButton";
import SectionHeader from "@/components/SectionHeader";
import { getSpecialtyMaster } from "@/redux/store/slices/calendarSlice";

const SpecialitiesSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const { specialties } = useSelector((state) => state.calendar);
  const { calendar } = useSelector((state) => state.calendar);

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    dispatch(getSpecialtyMaster());
  }, [dispatch]);

  // ⭐ NEW: Calendar se selected specialties ko populate karo
  useEffect(() => {
    if (!calendar?.specialties || !specialties.length) return;

    // Extract specialty IDs from calendar
    const activeSpecialtyIds = [];

    // Agar calendar.specialties array of IDs hai
    if (Array.isArray(calendar.specialties)) {
      calendar.specialties.forEach((specialtyId) => {
        // Check if it's already an ID
        if (typeof specialtyId === 'string') {
          activeSpecialtyIds.push(specialtyId);
        } 
        // Agar object hai with _id or id field
        else if (specialtyId._id) {
          activeSpecialtyIds.push(specialtyId._id);
        } else if (specialtyId.id) {
          activeSpecialtyIds.push(specialtyId.id);
        }
        // Agar name se match karna hai
        else if (specialtyId.name) {
          const matchingSpecialty = specialties.find(s => s.name === specialtyId.name);
          if (matchingSpecialty) {
            activeSpecialtyIds.push(matchingSpecialty._id);
          }
        }
      });
    }

    console.log("Active Specialty IDs:", activeSpecialtyIds); // Debug
    setSelected(activeSpecialtyIds);
  }, [calendar, specialties]); // calendar aur specialties dono ko track karo

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      <SectionHeader title="Specialities" />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1  }}>
        {specialties.map((item) => {
          const isActive = selected.includes(item._id);

          return (
            // <Box >
             <ToggleButton
             key={item._id}
                disabled={disabled}
                src={item.img}
                onClick={() => !disabled && handleToggle(item._id)}
                selected={isActive}
                sx={{
          width: "105px",
        height: "65px",
          flexDirection: "column",
          borderRadius: "7px !important",
          textTransform: "none",
          alignItems: "center",
          flexWrap:"wrap",
          justifyContent: "center",
          color:"#1172BA",
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
                    textTransform: "none",
                    color:isActive?"white":"#1172BA",
                  }}
                >
                  {item.name}
                </Typography>
               </ToggleButton>
            // </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SpecialitiesSection;