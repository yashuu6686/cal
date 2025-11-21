import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
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

      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {specialties.map((item) => {
          const isActive = selected.includes(item._id);

          return (
            <Box key={item._id}>
              <CommonButton
                disabled={disabled}
                src={item.img}
                onClick={() => !disabled && handleToggle(item._id)}
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
              </CommonButton>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SpecialitiesSection;