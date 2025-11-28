import {
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";
import { selectIsFieldsDisabled, selectServiceTypesForDropdown } from "@/redux/store/slices/calendarSlice";
import { useCallback, useState, memo } from "react";
import { TimePickerPair } from "@/components/timePickerUtils";
import CommonDialogBox from "@/components/CommonDialogBox";
import SectionHeader from "@/components/SectionHeader";


const SlotItem = memo(
  ({
    slot,
    index,
    dayIndex,
    day,
    serviceTypes,
    getError,
    handleChange,
    askDeleteConfirmation,
    clearError,
    isFieldsDisabled
  }) => {
    return (
      <Box sx={{ mt: 1, p: 1, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
          disabled={isFieldsDisabled}
            size="small"
            select
            label="Service Type"
            value={slot.serviceType?.id || ""}
            onChange={(e) => {
              const selected = serviceTypes.find(
                (s) => s.id === e.target.value
              );

              handleChange(day, index, "serviceType", {
                id: selected.id,
                name: selected.label,
                keyIdentifier: selected.keyIdentifier,
                duration: selected.duration,
              });
              clearError(dayIndex, index, "serviceType");
            }}
            sx={{ flex: 1, mr: 1 }}
            error={Boolean(getError(dayIndex, index, "serviceType"))}
            helperText={getError(dayIndex, index, "serviceType")}
          >
            {serviceTypes.length === 0 ? (
              <MenuItem disabled>No services selected</MenuItem>
            ) : (
              serviceTypes.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Typography>{s.label}</Typography>
                    <Chip
                      label={`${s.duration} minutes`}
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </MenuItem>
              ))
            )}
          </TextField>

          <IconButton
            disabled={isFieldsDisabled}
            onClick={() => askDeleteConfirmation(day, index)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", mt: 1.3, gap: 1, mb: 1 }}>
          <TimePickerPair
            disabled={isFieldsDisabled}
            startValue={slot.startTime}
            endValue={slot.endTime}
            size="small"
            onStartChange={(val) => {
              handleChange(day, index, "startTime", val);
              clearError(dayIndex, index, "start");
            }}
            onEndChange={(val) => {
              handleChange(day, index, "endTime", val);
              clearError(dayIndex, index, "end");
            }}
            startError={getError(dayIndex, index, "start")}
            endError={getError(dayIndex, index, "end")}
          />
        </Box>
      </Box>
    );
  }
);

SlotItem.displayName = "SlotItem";

SlotItem.displayName = "SlotItem";

export default function WorkingPlanView({
  slots,
  setSlots,
  days,
  wpErrors,
  clearError,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ day: null, index: null });

  const serviceTypes = useSelector(selectServiceTypesForDropdown);
  const isFieldsDisabled = useSelector(selectIsFieldsDisabled);



  const getError = useCallback(
    (dayIndex, slotIndex, field) => {
      const key = `weekSchedule[${dayIndex}].slots[${slotIndex}].${field}`;
      return wpErrors?.[key] || "";
    },
    [wpErrors]
  );

  const handleAddSlot = useCallback(
    (day) => {
      setSlots((prev) => ({
        ...prev,
        [day]: [
          ...prev[day],
          { serviceType: "", startTime: null, endTime: null },
        ],
      }));
    },
    [setSlots]
  );

  const handleChange = useCallback(
    (day, index, field, value) => {
      setSlots((prev) => {
        const updated = [...prev[day]];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, [day]: updated };
      });
    },
    [setSlots]
  );

  const askDeleteConfirmation = useCallback((day, index) => {
    setDeleteTarget({ day, index });
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = () => {
    const { day, index } = deleteTarget;
    setSlots((prev) => {
      const updated = [...prev[day]];
      updated.splice(index, 1);
      return { ...prev, [day]: updated };
    });

    setShowDeleteDialog(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SectionHeader title="Working plan" />
      <Box>
        {days.map((day, dayIndex) => (
          <Box
            key={day}
            sx={{ mb: 1, border: "1px solid #e3f2fd", borderRadius: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f5f9ff",
                padding: "4px 8px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 700, color: "#1565c0" }}>
                  {day}
                </Typography>

                {slots[day].length > 0 && (
                  <Chip
                    label={`${slots[day].length} slot${
                      slots[day].length > 1 ? "s" : ""
                    }`}
                    size="small"
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1565c0",
                      fontWeight: 600,
                      height: 22,
                    }}
                  />
                )}
              </Box>

              <Tooltip title="Add New Slot" arrow placement="left">
                <IconButton
                  size="small"
                  disabled={isFieldsDisabled}
                  onClick={() => handleAddSlot(day)}
                  sx={{
                    bgcolor: "#1172BA",
                    color: "white",
                    width: 33,
                    height: 33,
                    "&:hover": {
                      bgcolor: "#1172BA",
                      transform: "rotate(90deg)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <AddCircleOutlineIcon  fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {slots[day].length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ fontSize: "14px", color: "gray", mt: 1 }}>
                  No slots added yet. Click + to add a slot.
                </Typography>
              </Box>
            )}

            {slots[day].map((slot, index) => (
              <Box key={`${day}-${index}`}>
                <SlotItem
                  slot={slot}
                  index={index}
                  dayIndex={dayIndex}
                  day={day}
                  isFieldsDisabled={isFieldsDisabled}
                  serviceTypes={serviceTypes}
                  getError={getError}
                  handleChange={handleChange}
                  clearError={clearError}
                  askDeleteConfirmation={askDeleteConfirmation}
                />

                {/* Divider only if not last slot */}
                {index !== slots[day].length - 1 && (
                  <Divider sx={{ mx:2, borderColor: "#bbdefb" }} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <CommonDialogBox
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Slot?"
        message="Are you sure you want to delete this slot? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </LocalizationProvider>
  );
}
