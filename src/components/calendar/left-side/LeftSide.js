"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  setIsEditMode,
  updateDoctorCalendar,
} from "@/redux/store/slices/calendarSlice";
import {
  workingPlanSchema,
  step2ValidationSchema,
} from "../validation/validation";
import { buildCalendarPayload } from "../config/payload";
import CommonDialogBox from "@/components/CommonDialogBox";
import dayjs from "dayjs";

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

  const [advanceBooking, setAdvanceBooking] = useState({
    advanceBookingDays: 14,
    checkInTime: 60,
  });

  {
    /*STATIC MASTER PROFILE IS*/
  }
  const masterProfileId = "y444DFSDADASADSAD454SD4S5A4D4";

  //  NEW: Track if calendar has been loaded
  const hasLoadedCalendar = useRef(false);

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
    calendar,
    breaks: existingBreaks,
    holidays: existingHolidays,
  } = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(getDoctorCalendar());
  }, [dispatch]);

  useEffect(() => {
    if (
      hasLoadedCalendar.current ||
      !calendar?.availability ||
      calendar.availability.length === 0
    ) {
      return;
    }

    const mappedSlots = days.reduce((acc, d) => ({ ...acc, [d]: [] }), {});

    calendar.availability.forEach((item) => {
      const dayName = item.day;

      if (item.services && item.services.length > 0) {
        mappedSlots[dayName] = item.services.map((srv) => ({
          serviceType: {
            id: srv._id || srv.id,
            name: srv.name,
            keyIdentifier: srv.keyIdentifier,
            duration: srv.duration,
          },
          startTime: srv.startTime ? dayjs(srv.startTime, "HH:mm") : null,
          endTime: srv.endTime ? dayjs(srv.endTime, "HH:mm") : null,
        }));
      }
    });

    setSlots(mappedSlots);
    hasLoadedCalendar.current = true;
  }, [calendar]);

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
    const wpOk = await validateWorkingPlan();
    if (!wpOk) {
      setStep(1);
      return false;
    }

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
        {
          abortEarly: false,
          context: {
            breaks: existingBreaks || [], // ✅ Default to empty array
            existingHolidays: existingHolidays || [],
            editIndex: null,
            holidayEditIndex: null,
          },
        }
      );

      setBreakErrors({});
      setHolidayErrors({});
      return true;
    } catch (err) {
      const breakErr = {};
      const holidayErr = {};

      (err.inner || []).forEach((e) => {
        if (e.path === "breakSelectedDays") {
          breakErr["breakSelectedDays"] = e.message;
        } else if (e.path === "startTime") {
          breakErr["startTime"] = e.message;
        } else if (e.path === "endTime") {
          breakErr["endTime"] = e.message;
        } else if (e.path === "holidayDate") {
          holidayErr["holidayDate"] = e.message;
        } else if (e.path === "holidayStartTime") {
          holidayErr["holidayStartTime"] = e.message;
        } else if (e.path === "holidayEndTime") {
          holidayErr["holidayEndTime"] = e.message;
        }
      });

      setBreakErrors(breakErr);
      // console.log(breakErr);

      setHolidayErrors(holidayErr);
      return false;
    }
  };

  const handlePublishOrUpdate = async () => {
    const ok = await validateAll();
    if (!ok) return;

    const payload = buildCalendarPayload({
      selectedServices,
      services,
      selectedSpecialties,
      specialties,
      days,
      slots,
      breakData,
      masterProfileId,
      holidayData,
      advanceBooking,
      calendar,
    });

    console.log("FINAL PAYLOAD:", payload);

    if (calendar && calendar._id) {
      // UPDATE MODE
      const updatePayload = {
        calendarId: calendar._id,
        ...payload,
      };
      await dispatch(updateDoctorCalendar(updatePayload));
    } else {
      await dispatch(createDoctorCalendar(payload));
      // CREATE MODE
    }

    hasLoadedCalendar.current = false;
    await dispatch(getDoctorCalendar());

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

  const clearWpError = useCallback(
    (dayIndex, slotIndex, field) => {
      const key = `weekSchedule[${dayIndex}].slots[${slotIndex}].${field}`;

      if (wpErrors?.[key]) {
        setWpErrors((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }
    },
    [wpErrors]
  );

  const clearBreakError = useCallback(
    (fieldName) => {
      if (breakErrors?.[fieldName]) {
        setBreakErrors((prev) => {
          const updated = { ...prev };
          delete updated[fieldName];
          return updated;
        });
      }
    },
    [breakErrors]
  );

  const clearHolidayError = useCallback(
    (fieldName) => {
      if (holidayErrors?.[fieldName]) {
        setHolidayErrors((prev) => {
          const updated = { ...prev };
          delete updated[fieldName];
          return updated;
        });
      }
    },
    [holidayErrors]
  );

  const handleEdit = () => {
    if (calendar?._id) {
      dispatch(setIsEditMode(true));
      setStep(1); // ensure user comes back to editable step
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1,
        borderRadius: 2,
        height: "100vh !important",
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
                borderRadius: 1.8,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ color: "white", fontWeight: 200 }}>
                My Calendar
              </Typography>
              {calendar?._id && !isEditMode && (
                <Button
                  onClick={handleEdit}
                  sx={{ backgroundColor: "white", textTransform: "none" }}
                >
                  Edit
                </Button>
              )}
            </Box>

            <Box>
              <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

              <ServiceTypeSection
                days={days}
                slots={slots}
                setSlots={setSlots}
              />

              <Divider sx={{ mb: 2, borderColor: "#bbdefb" }} />

              <SpecialitiesSection
                selectedSpecialties={selectedSpecialties}
                setSelectedSpecialties={setSelectedSpecialties}
                advanceBooking={advanceBooking}
                setAdvanceBooking={setAdvanceBooking}
              />

              <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

              <WorkingPlanView
                slots={slots}
                setSlots={setSlots}
                days={days}
                wpErrors={wpErrors}
                setWpErrors={setWpErrors}
                clearError={clearWpError}
              />
            </Box>

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
              clearError={clearBreakError}
            />
            <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />
            <Holiday
              holidayErrors={holidayErrors}
              holidayData={holidayData}
              setHolidayData={setHolidayData}
              clearError={clearHolidayError}
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
