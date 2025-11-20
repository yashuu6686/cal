"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormikContext } from "formik";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Chip,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import CommonDialogBox from "@/components/CommonDialogBox";
import SectionHeader from "@/components/SectionHeader";
// If your timePickerUtils exports CommonTimePicker, import it; otherwise import TimePicker
import { CommonTimePicker } from "@/components/timePickerUtils";

import {
  addSlotToDay,
  removeSlotFromDay,
  updateSlotInDay,
  updateEvents,
} from "@/redux/store/slices/calendarSlice";

// days array (unchanged)
const days = [
  { short: "Sun", full: "Sunday" },
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
];

const TOTAL_DAY_MINUTES = 1440;
const MAX_SLOTS_WITHOUT_SERVICE = 96;


const SlotItemMemo = React.memo(function SlotItemMemo({
  slot,
  dayName,
  onRemove,
  onUpdate,
  selectedServices,
}) {
  // local state to avoid sending every change to redux/formik
  const [localStart, setLocalStart] = useState(slot.start ? dayjs(slot.start) : null);
  const [localEnd, setLocalEnd] = useState(slot.end ? dayjs(slot.end) : null);

  // controls whether heavy TimePicker is mounted
  const [editingStart, setEditingStart] = useState(false);
  const [editingEnd, setEditingEnd] = useState(false);

  // when the parent slot prop changes (redux/formik updated), sync local values
  React.useEffect(() => {
    setLocalStart(slot.start ? dayjs(slot.start) : null);
    setLocalEnd(slot.end ? dayjs(slot.end) : null);
  }, [slot.start, slot.end]);

  // confirm handlers: update redux once user accepts
  const confirmStart = (val) => {
    setEditingStart(false);
    setLocalStart(val);
    onUpdate(dayName, slot.id, "start", val ? val.toISOString() : null);
  };

  const confirmEnd = (val) => {
    setEditingEnd(false);
    setLocalEnd(val);
    onUpdate(dayName, slot.id, "end", val ? val.toISOString() : null);
  };

  // If service type change must immediately reflect duration etc. we can dispatch immediately:
  const handleServiceChange = (e) => {
    const newServiceType = e.target.value;
    onUpdate(dayName, slot.id, "serviceType", newServiceType);

    // if you want to auto-update duration on service change:
    const svc = selectedServices.find((s) => s.type === newServiceType);
    const duration = svc ? parseInt(svc.time, 10) : slot.duration || 15;
    onUpdate(dayName, slot.id, "duration", duration);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, borderRadius: "8px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
        <TextField
          select
          label="Service Type"
          size="small"
          value={slot.serviceType || ""}
          onChange={handleServiceChange}
          sx={{ flexGrow: 1 }}
        >
          {selectedServices.map((s) => (
            <MenuItem key={s.type} value={s.type}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <span>{s.type}</span>
                <Chip label={`${s.time} minutes`} size="small" />
              </Stack>
            </MenuItem>
          ))}
        </TextField>

        <Tooltip title="Delete Slot">
          <IconButton
            onClick={() => onRemove(dayName, slot.id)}
            sx={{
              color: "#d32f2f",
              bgcolor: "#ffebee",
              "&:hover": { bgcolor: "#ffcdd2", transform: "scale(1.05)" },
            }}
            size="small"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Start Time field — readonly display, opens TimePicker on focus/click */}
        <TextField
          label="Start Time"
          size="small"
          value={localStart ? dayjs(localStart).format("HH:mm") : ""}
          onFocus={() => setEditingStart(true)}
          onClick={() => setEditingStart(true)}
          InputProps={{ readOnly: true }}
          sx={{ flex: 1 }}
        />

        {/* End Time field */}
        <TextField
          label="End Time"
          size="small"
          value={localEnd ? dayjs(localEnd).format("HH:mm") : ""}
          onFocus={() => setEditingEnd(true)}
          onClick={() => setEditingEnd(true)}
          InputProps={{ readOnly: true }}
          sx={{ flex: 1 }}
        />

        {/* Lazy-mounted TimePickers — only when user opens them */}
        {editingStart && (
          <CommonTimePicker
            label="Start Time picker"
            value={localStart}
            onChange={(val) => setLocalStart(val)}
            disabled={false}

          />
        )}

        {editingEnd && (
          <CommonTimePicker
            label="End Time picker"
            value={localEnd}
            onChange={(val) => setLocalEnd(val)}
            disabled={false}
          />
        )}
      </Box>

    </Box>
  );
},
// areEqual: shallow compare slot fields that matter
(prev, next) => {
  const a = prev.slot;
  const b = next.slot;
  return (
    a.id === b.id &&
    a.serviceType === b.serviceType &&
    (a.start ? a.start : "") === (b.start ? b.start : "") &&
    (a.end ? a.end : "") === (b.end ? b.end : "")
  );
});

const WorkingPlanView = ({ disabled = false }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);

  const dispatch = useDispatch();
  const { errors } = useFormikContext();

  // Redux selectors
  const weekSchedule = useSelector((state) => state.calendar.weekSchedule);
  const selectedServices = useSelector((state) => state.ui.selectedServices);
  const selectedSpecialities = useSelector((state) => state.ui.selectedSpecialities);

  // helper: get day object from weekSchedule (avoid using heavy derived state)
  const getDayData = useCallback(
    (dayName) => weekSchedule.find((d) => d.day === dayName) || { day: dayName, slots: [] },
    [weekSchedule]
  );

  const handleAddSlot = useCallback(
    (day) => {
      if (selectedServices.length === 0 || selectedSpecialities.length === 0) {
        toast.error("Please select Specialities and Service Type before adding a slot.");
        return;
      }
      // picking first selected service for duration like your original logic:
      const selectedService = selectedServices[0];
      const serviceDuration = Number(selectedService.time);
      // count minutes used today
      const totalUsedMinutes = weekSchedule.reduce((total, d) => {
        return total + d.slots.reduce((sub, s) => sub + Number(s.duration || 0), 0);
      }, 0);
      const totalSlots = weekSchedule.reduce((count, d) => count + d.slots.length, 0);

      if (selectedServices.length === 0 && totalSlots >= MAX_SLOTS_WITHOUT_SERVICE) {
        toast.error("You can add up to 96 slots without a service type.");
        return;
      }
      if (totalUsedMinutes + serviceDuration > TOTAL_DAY_MINUTES) {
        toast.error("Cannot add slot. 24-hour limit exceeded.");
        return;
      }

      const newSlot = {
        id: Date.now(),
        start: null,
        end: null,
        serviceType: selectedService.type,
        duration: serviceDuration,
        speciality: selectedSpecialities.map((s) => s.type),
      };

      dispatch(addSlotToDay({ day, slot: newSlot }));
      dispatch(updateEvents());
    },
    [dispatch, selectedServices, selectedSpecialities, weekSchedule]
  );

  const handleRemoveSlot = useCallback(
    (day, slotId) => {
      dispatch(removeSlotFromDay({ day, slotId }));
      dispatch(updateEvents());
    },
    [dispatch]
  );

  const handleUpdateSlot = useCallback(
    (day, slotId, field, value) => {
      // send single-field update to redux
      dispatch(updateSlotInDay({ day, slotId, field, value }));
      // optionally update events after changing times
      if (field === "start" || field === "end" || field === "duration") {
        dispatch(updateEvents());
      }
    },
    [dispatch]
  );

  // show formik errors as toast (keeps your original behavior)
  React.useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const flat = [];
      const flatten = (obj) => {
        Object.values(obj).forEach((v) => {
          if (typeof v === "string") flat.push(v);
          else if (v && typeof v === "object") flatten(v);
        });
      };
      flatten(errors);
      flat.forEach((msg) => msg && toast.error(msg));
    }
  }, [errors]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <SectionHeader title="Working Plan" />

        <Box>
          {days.map((day, dayIndex) => {
            const dayData = getDayData(day.full);
            const daySlots = dayData.slots || [];

            return (
              <Paper key={day.short} elevation={0} sx={{ mb: 1.5, borderRadius: 2, overflow: "hidden", border: "1px solid #e3f2fd" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#f5f9ff", px: 1, py: 0.5 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#1565c0" }}>{day.full}</Typography>
                    {daySlots.length > 0 && (
                      <Chip label={`${daySlots.length} slot${daySlots.length > 1 ? "s" : ""}`} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1565c0", fontWeight: 500, height: 24 }} />
                    )}
                  </Stack>

                  <Tooltip title="Add New Slot" arrow placement="left">
                    <IconButton
                      size="small"
                      disabled={disabled}
                      onClick={() => handleAddSlot(day.full)}
                      sx={{
                        bgcolor: "#1172BA",
                        color: "white",
                        width: 33,
                        height: 33,
                        "&:hover": { bgcolor: "#1172BA", transform: "rotate(90deg)" },
                        "&:disabled": { bgcolor: "#90caf9", color: "white" },
                        transition: "all 0.3s",
                      }}
                    >
                      <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ p: 1 }}>
                  {daySlots.length === 0 ? (
                    <Typography variant="body2" sx={{ color: "#90a4ae", textAlign: "center", fontStyle: "italic" }}>
                      No slots added yet. Click + to add a slot.
                    </Typography>
                  ) : (
                    <Box>
                      {daySlots.map((slot, slotIndex) => (
                        <React.Fragment key={slot.id}>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, borderRadius: "8px" }}>
                            <SlotItemMemo
                              slot={slot}
                              dayName={day.full}
                              selectedServices={selectedServices}
                              onRemove={(d, id) => handleRemoveSlot(d, id)}
                              onUpdate={(d, id, field, value) => handleUpdateSlot(d, id, field, value)}
                            />
                          </Box>

                          {slotIndex < daySlots.length - 1 && <Divider sx={{ border: "1px solid #e3f2fd" }} />}
                        </React.Fragment>
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>
            );
          })}

          <CommonDialogBox
            open={Boolean(openDelete)}
            onClose={() => setOpenDelete(false)}
            onConfirm={() => {
              if (slotToDelete) {
                handleRemoveSlot(slotToDelete.day, slotToDelete.slotId);
                setSlotToDelete(null);
                setOpenDelete(false);
              }
            }}
            title="Delete Slot"
            message={`Are you sure you want to delete ${slotToDelete?.slotName || "this slot"}?`}
            confirmText="Delete"
            confirmColor="primary"
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default WorkingPlanView;
