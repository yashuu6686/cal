"use client";
import React, { useEffect, useState } from "react";
import { Paper, Box, Typography, Button, Divider } from "@mui/material";
import LoadingOverlay from "./LoadingOverlay";
import ErrorAlert from "./ErrorAlert";
import AddServiceDialog from "./AddServiceDialog";
import ServiceTypeSection from "./ServiceTypeSection";
import SpecialitiesSection from "./SpecialitiesSection";
import WorkingPlanView from "./working-plan/WorkingPlanView";
import Holiday from "../right-side/Holiday";
import Break from "../right-side/Break";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  createDoctorCalendar,
  getDoctorCalendar,
} from "@/redux/store/slices/calendarSlice";
import { workingPlanSchema, step2ValidationSchema } from "../validation/validation"; // ADD THIS IMPORT
import { buildCalendarPayload } from "../config/payload";
import CommonDialogBox from "@/components/CommonDialogBox";

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
  const [breakErrors, setBreakErrors] = useState({});
  const [holidayErrors, setHolidayErrors] = useState({});

  const [showMissingDialog, setShowMissingDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(getDoctorCalendar());
  }, [dispatch]);

  const validateWorkingPlan = async () => {
    const weekSchedule = days.map((day) => ({
      day,
      slots: slots[day].map((slot) => ({
        serviceType: slot.serviceType,
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

  const validateAll = async () => {
    // 1️⃣ Working Plan validate
    const wpOk = await validateWorkingPlan();
    if (!wpOk) {
      setStep(1);
      return false;
    }

    // 2️⃣ Step-2 (Break + Holiday) validate
    try {
      await step2ValidationSchema.validate(
        {
          breakSelectedDays: breakData.selectedDays,
          startTime: breakData.breakStartTime,
          endTime: breakData.breakEndTime,
          holidayDate: holidayData.date,
          holidayStartTime: holidayData.startTime,
          holidayEndTime: holidayData.endTime,
        },
        { abortEarly: false }
      );

      // Clear errors if validation passes
      setBreakErrors({});
      setHolidayErrors({});
      return true;
    } catch (err) {
      console.log("STEP2 VALIDATION ERRORS:", err.inner);

      const breakErr = {};
      const holidayErr = {};

      (err.inner || []).forEach((e) => {
        console.log("Error path:", e.path, "Message:", e.message);
        
        // Map break errors
        if (e.path === "breakSelectedDays") {
          breakErr["breakSelectedDays"] = e.message;
        } else if (e.path === "startTime") {
          breakErr["startTime"] = e.message;
        } else if (e.path === "endTime") {
          breakErr["endTime"] = e.message;
        }
        // Map holiday errors
        else if (e.path === "holidayDate") {
          holidayErr["holidayDate"] = e.message;
        } else if (e.path === "holidayStartTime") {
          holidayErr["holidayStartTime"] = e.message;
        } else if (e.path === "holidayEndTime") {
          holidayErr["holidayEndTime"] = e.message;
        }
      });

      console.log("Break Errors:", breakErr);
      console.log("Holiday Errors:", holidayErr);

      setBreakErrors(breakErr);
      setHolidayErrors(holidayErr);
      return false;
    }
  };

  const handlePublishOrUpdate = async () => {
    const ok = await validateAll();
    if (!ok) return; // IMPORTANT: Don't proceed if validation fails
    
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
      setBreakData({
    selectedDays: [],
    breakStartTime: null,
    breakEndTime: null,
  });

  setHolidayData({
    date: null,
    startTime: null,
    endTime: null,
  });

  // ⭐ CLEAR ERRORS ALSO
  setBreakErrors({});
  setHolidayErrors({});

    setStep(1);
  };

  const checkRequiredBeforePublish = () => {
    if (!selectedServices || selectedServices.length === 0) {
      setDialogMessage(
        "Please select at least one Service Type before continuing."
      );
      setShowMissingDialog(true);
      return false;
    }

    if (!selectedSpecialties || selectedSpecialties.length === 0) {
      setDialogMessage(
        "Please select at least one Speciality before continuing."
      );
      setShowMissingDialog(true);
      return false;
    }

    const hasSlot = days.some((d) => slots[d].length > 0);

    if (!hasSlot) {
      setDialogMessage(
        "Please add at least one working slot before publishing."
      );
      setShowMissingDialog(true);
      return false;
    }

    return true;
  };

  const nextStep = async () => {
    if (!checkRequiredBeforePublish()) return;
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
            <Break
              breakData={breakData}
              setBreakData={setBreakData}
              breakErrors={breakErrors}
            />
            <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />
            <Holiday
              holidayErrors={holidayErrors}
              holidayData={holidayData}
              setHolidayData={setHolidayData}
            />

            <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
              <Button
                variant="outlined"
                sx={{
                  mr: 0.5,
                  fontSize: "0.9rem",
                  textTransform: "none",
                }}
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                onClick={handlePublishOrUpdate}
                sx={{ textTransform: "none" }}
              >
                {isCalendarPublished ? "Update Calendar" : "Publish Calendar"}
              </Button>
            </Box>
          </>
        )}
      </Box>

      <AddServiceDialog />
      <CommonDialogBox
        open={showMissingDialog}
        onClose={() => setShowMissingDialog(false)}
        onConfirm={() => setShowMissingDialog(false)}
        title="Missing Information"
        message={dialogMessage}
        confirmText="OK"
        hideCancel={true}
      />
    </Paper>
  );
}

export default LeftSide;