"use client";
import React, { useState } from "react";
import {
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import CommonCard from "@/components/CommonCard";
import Image from "next/image";
import dayjs from "dayjs";
import { Edit } from "@mui/icons-material";
import {
  video,
  clinic,
  home,
  tooth,
  gen,
  nuro,
  ortho,
  cardio,
  WorkingPlan,
  Specialitie,
  AdvanceBooking,
  AppointmentBooking,
  Break,
  Holidays,
  weekDays,
  serviceOptions,
} from "./component/index";

import {
  validationSchema,
  holidayValidationSchema,
  validateSlotAndSave,
  validateHolidayAndSave,
} from "./component/validation"; // your Yup validation + functions

const initialState = [
  { img: video, type: " Video Call", time: "15 Minutes" },
  { img: home, type: " Home Visit", time: "90 Minutes" },
  { img: clinic, type: " Clinic Visit", time: "15 Minutes" },
];

import calendar from "../../public/calendar.png";

const MyCalendar = () => {
  const [item, setItem] = useState({ name: "", duration: null, service: null });
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [dataOfService, setDataOfService] = useState(initialState);

  const [calendarPublished, setCalendarPublished] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [breakModalOpen, setBreakModalOpen] = useState(false);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [openAddService, setOpenAddService] = useState(false);

  const [schedule, setSchedule] = useState([]);
  const [newSlot, setNewSlot] = useState({
    startTime: "",
    endTime: "",
    days: [],
    service: "",
  });

  const [newBreak, setNewBreak] = useState({
    day: [],
    startTime: "",
    endTime: "",
  });
  const [breaks, setBreaks] = useState([]);

  const [holiday, setHoliday] = useState({
    date: null,
    startTime: "",
    endTime: "",
  });
  const [holidays, setHolidays] = useState([]);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [workingPlanErrors, setWorkingPlanErrors] = useState({});
  const [breakErrors, setBreakErrors] = useState({});
  const [holidayErrors, setHolidayErrors] = useState({});

  // ---------------------------
  // Validate entire calendar
  // ---------------------------
  const validateCalendar = () => {
    const errorObjects = [workingPlanErrors, breakErrors, holidayErrors];

    const hasAnyErrors = errorObjects.some((errorObj) =>
      Object.values(errorObj).some(
        (err) => err && Object.values(err).some((msg) => msg)
      )
    );
      const invalidSlot = schedule.some((daySlots) =>
      (daySlots || []).some((slot) => {
        if (!slot.startTime && !slot.endTime) return false; //
        const start = dayjs(`1970-01-01T${slot.startTime}`);
        const end = dayjs(`1970-01-01T${slot.endTime}`);
        return !slot.startTime || !slot.endTime || !end.isAfter(start);
      })
    );

    const validations = [
    { condition: hasAnyErrors, message: "Please select valid Start Time & End Time." },
    { condition: selectedServices.length === 0, message: "At least one service is required." },
    { condition: selectedSpecialities.length === 0, message: "Please select at least one Speciality." },
    { condition: schedule.length === 0 || schedule.every((day) => !day || day.length === 0), message: "Please add at least one Working Plan." },
     { condition: invalidSlot, message: "Please select valid Start Time & End Time." },
  ];

  for (const validation of validations) {
    if (validation.condition) {
      setErrorMessage(validation.message);
      setErrorDialogOpen(true);
      return false; // stops at first failed validation
    }
  }
  

    return true;
  };

  const handlePublish = () => {
    if (validateCalendar()) {
      setCalendarPublished(true);
      setEditMode(false);
    }
  };

  const handleUpdate = () => {
    if (validateCalendar()) setEditMode(false);
  };

  // ---------------------------
  // Handle Save
  // ---------------------------
  const handleSave = async (type, slotOrHoliday) => {
    if (calendarPublished && !editMode) return;

    switch (type) {
      case "workingPlan":
        // Always save the slot, even if invalid
        setSchedule((prev) => {
          const updated = [...prev];
          slotOrHoliday.days.forEach((dayIndex) => {
            if (!Array.isArray(updated[dayIndex])) updated[dayIndex] = [];
            updated[dayIndex].push({ ...slotOrHoliday, id: Date.now() });
          });
          return updated;
        });
        setModalOpen(false);
        setNewSlot({ service: "", startTime: "", endTime: "", days: [] });
        break;

      case "break":
        if (newBreak.day.length > 0 && newBreak.startTime && newBreak.endTime) {
          const expandedBreaks = newBreak.day.map((dayIdx) => ({
            ...newBreak,
            day: dayIdx,
          }));
          setBreaks((prev) => [...prev, ...expandedBreaks]);
          setBreakModalOpen(false);
          setNewBreak({ day: [], startTime: "", endTime: "" });
        } else {
          setErrorMessage(
            "Please select at least one day, start time, and end time"
          );
          setErrorDialogOpen(true);
        }
        break;

      case "holiday":
        await validateHolidayAndSave({
          values: slotOrHoliday,
          validationSchema: holidayValidationSchema,
          holidays,
          setErrors: (err) => {
            setErrorMessage(err.startTime || err.date);
            setErrorDialogOpen(true);
          },
          setHolidays,
          onSave: (validatedHoliday) => {
            setHolidays((prev) => [...prev, validatedHoliday]);
            setHolidayModalOpen(false);
            setHoliday({ date: null, startTime: "", endTime: "" });
          },
        });
        break;

      default:
        break;
    }
  };

  const deleteSlot = (dayIndex, id) => {
    if (calendarPublished && !editMode) return;
    setSchedule((prev) =>
      prev.map((daySlots, idx) =>
        idx === dayIndex ? daySlots.filter((slot) => slot.id !== id) : daySlots
      )
    );
  };

  const handeleDisableFun = () => {
    if (selectedServices.length === 0) {
      setErrorMessage(
        "Please select at least one Service Type before adding Working Plan."
      );
      setErrorDialogOpen(true);
      return;
    }
    if (selectedSpecialities.length === 0) {
      setErrorMessage(
        "Please select at least one Speciality before adding Working Plan."
      );
      setErrorDialogOpen(true);
      return;
    }

    if (!calendarPublished || editMode) {
      setNewSlot({ service: "", startTime: "", endTime: "", days: [] });
      setModalOpen(true);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <CommonCard
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Image
              alt="Calendar"
              src={calendar}
              style={{ width: 25, height: 25, objectFit: "contain" }}
            />
            My Calendar
          </span>
        }
        actions={[
          {
            label: !calendarPublished ? (
              "Publish Calendar"
            ) : editMode ? (
              "Update Calendar"
            ) : (
              <Edit sx={{ fontSize: 20 }} />
            ),
            onClick: () => {
              if (!calendarPublished) handlePublish();
              else if (editMode) handleUpdate();
              else setEditMode(true);
            },
            variant: "contained",
          },
        ]}
        sx={{ minHeight: "100vh", m: 1 }}
      >
        <Grid container sx={{ mt: 2 }} spacing={0.5}>
          <Grid item size={{ xs: 12, md: 9, lg: 9 }}>
            <WorkingPlan
              setWorkingPlanErrors={setWorkingPlanErrors}
              setSchedule={setSchedule}
              weekDays={weekDays}
              data={[
                { type: "Days" },
                { type: "Service" },
                { type: "Start Time" },
                { type: "End Time" },
                { type: "Action" },
              ]}
              selectedServices={selectedServices}
              deleteSlot={deleteSlot}
              openModal={handeleDisableFun}
              schedule={schedule}
              editMode={calendarPublished ? editMode : true}
              serviceOptions={[
                ...serviceOptions,
                ...selectedSpecialities.map((s) => (s.type ? s.type : s)),
              ]}
            />

            <Grid container spacing={0.5} mt="6px">
              <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
                <Break
                  breaks={breaks}
                  setBreaks={setBreaks}
                  newBreak={newBreak}
                  setNewBreak={setNewBreak}
                  breakModalOpen={breakModalOpen}
                  setBreakModalOpen={setBreakModalOpen}
                  handleSave={handleSave}
                  editMode={calendarPublished ? editMode : true}
                  setBreakErrors={setBreakErrors}
                />
              </Grid>

              <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
                <Holidays
                  holidayModalOpen={holidayModalOpen}
                  setHolidayModalOpen={setHolidayModalOpen}
                  holiday={holiday}
                  setHoliday={setHoliday}
                  handleSave={handleSave}
                  holidays={holidays}
                  setHolidays={setHolidays}
                  editMode={calendarPublished ? editMode : true}
                  setHolidayErrors={setHolidayErrors}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item size={{ xs: 12, md: 3, lg: 3 }}>
            <Specialitie
              item={item}
              setItem={setItem}
              handleSave={handleSave}
              openAddService={openAddService}
              setOpenAddService={setOpenAddService}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              selectedSpecialities={selectedSpecialities}
              setSelectedSpecialities={setSelectedSpecialities}
              openModal={() =>
                calendarPublished && editMode && setModalOpen(true)
              }
              editMode={calendarPublished ? editMode : true}
              dataOfService={dataOfService}
              setDataOfService={setDataOfService}
              Specialities={[
                { img: nuro, type: "Neurologist" },
                { img: gen, type: "General" },
                { img: ortho, type: "Orthopaedic" },
                { img: tooth, type: "Dental" },
                { img: cardio, type: "Cardiology" },
              ]}
            />

            <Grid item xs={12} mt="6px">
              <AdvanceBooking editMode={calendarPublished && !editMode} />
            </Grid>
          </Grid>
        </Grid>

        <AppointmentBooking
          key={modalOpen ? Date.now() : "appointment-modal"}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          setNewSlot={setNewSlot}
          newSlot={newSlot}
          serviceOptions={[
            ...selectedServices.map((s) => (s.type ? s.type : s)),
          ]}
          weekDays={weekDays}
          selectedServices={selectedServices}
          handleSave={handleSave}
          schedule={schedule}
        />
      </CommonCard>

      {/* Error Dialog */}
     <Dialog
  open={errorDialogOpen}
  onClose={() => setErrorDialogOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 3,
      overflow: "hidden",
      minWidth: 320,
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: "#1976d2",
      p: "10px 16px",
      color: "white",
      mb: 1,
    }}
  >
    <Typography sx={{ fontWeight: 500 }}>Error</Typography>
  </DialogTitle>

  <DialogContent>
    <Typography
      sx={{
        ml: 2,
        mt: 0.5,
        color: "black",
        fontSize: "0.95rem",
      }}
    >
      Error
    </Typography>
  </DialogContent>

  <DialogActions sx={{ pr: 2, pb: 1 }}>
    <Button
      variant="contained"
      onClick={() => setErrorDialogOpen(false)}
      sx={{
        textTransform: "none",
        borderRadius: 2,
        px: 3,
      }}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default MyCalendar;
