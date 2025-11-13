import React from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleSpeciality } from "@/redux/store/slices/calendarSlice";
import { useCalendarState } from "@/hook/useCalendarState";
import CommonButton from "@/components/CommonButton";
import SectionHeader from "@/components/SectionHeader";
// import { sectionHeaderStyles } from "./styles";

const SpecialitiesSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const { specialities, selectedSpecialities } = useCalendarState();

  return (
    <Box sx={{ mb: 2 }}>
      <SectionHeader
             title="Specialities"
            
           />

      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {specialities.map((item, i) => {
          const isSelected = selectedSpecialities.some(
            (s) => s.type === item.type
          );
          return (
            <CommonButton
              disabled={disabled}
              key={i}
              src={item.img}
              isSelected={isSelected}
              onClick={() => dispatch(toggleSpeciality(item))}
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
            </CommonButton>
          );
        })}
      </Box>
    </Box>
  );
};

export default SpecialitiesSection;
