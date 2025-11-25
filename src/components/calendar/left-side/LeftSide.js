"use client";
import React, { useEffect, useState } from "react";
import { Paper, Box, Typography, Button, Divider } from "@mui/material";
import LoadingOverlay from "./LoadingOverlay";
import ErrorAlert from "./ErrorAlert";
// import Step1Form from "./Step1Form";
// import Step2Form from "./Step2Form";
import AddServiceDialog from "./AddServiceDialog";

// import { useCalendarState } from "@/hook/useCalendarState";
// import { useCalendarAPI } from "@/hook/useCalendarAPI ";
import ServiceTypeSection from "./ServiceTypeSection";
import SpecialitiesSection from "./SpecialitiesSection";
import WorkingPlanView from "./WorkingPlanView";
import Holiday from "../right-side/Holiday";
import Break from "../right-side/Break";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  createDoctorCalendar,
  getDoctorCalendar,
} from "@/redux/store/slices/calendarSlice";
import { workingPlanSchema } from "../validation/validation";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function LeftSide() {
  const [step, setStep] = useState(1);
  const [openAddService, setOpenAddService] = useState(false);
  const [slots, setSlots] = useState(
    days.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );
  // console.log(slots);

  const [breakData, setBreakData] = useState({
    selectedDays: [],
    breakStartTime: null,
    breakEndTime: null,
  });

  const [holidayData, setHolidayData] = useState({
    date: null,
    startTime: null,
    endTime: null,
  });

  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [wpErrors, setWpErrors] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDoctorCalendar());
  }, [dispatch]);

  const {
    isLoading,
    isCalendarPublished,
    isEditMode,
    apiError,
    apiSuccess,
    selectedServices,
    specialties,
    services,
  } = useSelector((state) => state.calendar);

  const handlePublishOrUpdate = () => {
    const payload = buildCalendarPayload({
      selectedServices,
      services,
      selectedSpecialties,
      specialties,
      days,
      slots,
      breakData,
      holidayData,
    });

    console.log("FINAL PAYLOAD:", payload);

    dispatch(createDoctorCalendar(payload));
  };

  const validateWorkingPlan = async () => {
    const weekSchedule = days.map((day) => ({
      day,
      slots: slots[day].map((slot) => ({
        serviceType: slot.serviceType?.name || "",
        start: slot.startTime,
        end: slot.endTime,
      })),
    }));

    try {
      await workingPlanSchema.validate({ weekSchedule }, { abortEarly: false });

      setWpErrors({});
      return true;
    } catch (err) {
      const formatted = {};
     (err.inner || []).forEach((e) => {
      formatted[e.path] = e.message;
    });

      setWpErrors(formatted);
      return false;
    }
  };
  const nextStep = async () => {
    const ok = await validateWorkingPlan();
    if (!ok) return;
    setStep(2);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 4,
        height: "116vh !important",
        overflowY: "auto",
        top: 0,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
      }}
    >
      <LoadingOverlay isLoading={isLoading} isPublished={isCalendarPublished} />
      <ErrorAlert error={apiError} />

      <Box>
        {step === 1 && (
          <Box>
            <Box
              sx={{
                background: "#1172BA",
                p: 0.6,
                borderRadius: 3,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ color: "white", fontWeight: 200 }}>
                My Calendar
              </Typography>

              {isCalendarPublished && !isEditMode && (
                <Button
                  variant="contained"
                  onClick={() => dispatch(setIsEditMode(true))}
                  sx={{
                    mr: 1,
                    backgroundColor: "white",
                    color: "#1976d2",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                  }}
                >
                  ✏️
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

            <ServiceTypeSection />

            <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

            <SpecialitiesSection
              selectedSpecialties={selectedSpecialties}
              setSelectedSpecialties={setSelectedSpecialties}
            />

            <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

            <WorkingPlanView
              slots={slots}
              setSlots={setSlots}
              days={days}
              wpErrors={wpErrors}
            />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
              {(!isCalendarPublished || isEditMode) && (
                <Button
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  onClick={nextStep}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        )}

        {step === 2 && (
          <>
            <Break breakData={breakData} setBreakData={setBreakData} />
            <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />
            <Holiday
              holidayData={holidayData}
              setHolidayData={setHolidayData}
            />

            <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
              <Button
                variant="outlined"
                sx={{
                  mr: 0.5,
                  // borderRadius: 2.5,
                  // fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "none",
                }}
                onClick={()=>setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                // disabled={isSubmitting}
                onClick={handlePublishOrUpdate}
                sx={{ textTransform: "none" }}
                //   sx={buttonGradientStyles}
              >
                {isCalendarPublished ? "Update Calendar" : "Publish Calendar"}
              </Button>
            </Box>
          </>
        )}
      </Box>

      <AddServiceDialog />
    </Paper>
  );
}

export default LeftSide;
