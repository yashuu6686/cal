import {
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSlot,
  selectIsFieldsDisabled,
  selectServiceTypesForDropdown,
} from "@/redux/store/slices/calendarSlice";
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
    isFieldsDisabled,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mt: 1,
          p: 0.5,
          borderRadius: 2,
          backgroundColor: "#fafafa",
          width: "100%",
        }}
      >
        <TextField
          disabled={isFieldsDisabled}
          size="small"
          select
          sx={{
            flex: 1, // Equal width
            minWidth: 0, // prevent overflow
            ".MuiInputBase-root": { height: 40 },
            // width: "170px",
            ".MuiSvgIcon-root": {
              right: 0,
            },
          }}
          label="Service Type"
          value={slot.serviceType?.id || ""}
          onChange={(e) => {
            const selected = serviceTypes.find((s) => s.id === e.target.value);
            handleChange(day, index, "serviceType", {
              id: selected.id,
              name: selected.label,
              keyIdentifier: selected.keyIdentifier,
              duration: selected.duration,
            });
            clearError(dayIndex, index, "serviceType");
          }}
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
                  <Typography sx={{ mr: "3px" }}>{s.label}</Typography>
                  <Chip
                    sx={{
                      ml: "2px",
                      flexShrink: 0,
                      fontSize: "12px", // optional
                      height: 22,
                    }}
                    label={`${s.duration} min`}
                    size="small"
                    color="primary"
                  />
                </Box>
              </MenuItem>
            ))
          )}
        </TextField>

        {/* Time Picker Pair in Same Row */}
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

        <IconButton
          disabled={isFieldsDisabled}
          onClick={() => askDeleteConfirmation(day, index)}
          color="error"
          sx={{
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.04)",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  }
);

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
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);

   const [copyToAll, setCopyToAll] = useState(false);


  const serviceTypes = useSelector(selectServiceTypesForDropdown);
  const isFieldsDisabled = useSelector(selectIsFieldsDisabled);

  const dispatch = useDispatch();

  const getError = useCallback(
    (dayIndex, slotIndex, field) => {
      const key = `weekSchedule[${dayIndex}].slots[${slotIndex}].${field}`;
      return wpErrors?.[key] || "";
    },
    [wpErrors]
  );

  const handleAddSlot = useCallback(
    (day) => {
      if (serviceTypes.length === 0) {
        setShowWarningDialog(true);
        return;
      }

      setSlots((prev) => ({
        ...prev,
        [day]: [
          ...prev[day],
          {
            serviceType: { id: "", name: "", duration: "", keyIdentifier: "" },
            startTime: null,
            endTime: null,
          },
        ],
      }));
    },
    [setSlots, serviceTypes]
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

    // Get the slot before deleting to access its _id
    const slotToDelete = slots[day][index];

    // ✅ Local state se remove karo (UI ke liye)
    setSlots((prev) => {
      const updated = [...prev[day]];
      updated.splice(index, 1);
      return { ...prev, [day]: updated };
    });

    const dayIndex = days.indexOf(day);
    dispatch(
      deleteSlot({
        dayIndex,
        slotIndex: index,
        slotId: slotToDelete?._id,
      })
    );

    setShowDeleteDialog(false);
  };

 const confirmCopy = () => {
  const sundaySlots = slots["Sunday"];

  setSlots((prev) => {
    const updated = { ...prev };

    days.forEach((d) => {
     
      if (d !== "Sunday" && prev[d].length === 0) {
        updated[d] = sundaySlots.map((slot) => ({
          ...slot,
          startTime: slot.startTime ? slot.startTime.clone() : null,
          endTime: slot.endTime ? slot.endTime.clone() : null,
        }));
      }
    });

    return updated;
  });

  setCopyToAll(true);
  setShowCopyDialog(false);
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1,justifyContent:'space-between' }}>
                
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
                   {day === "Sunday" && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={copyToAll}
                    disabled={slots["Sunday"].length === 0 || isFieldsDisabled}
                    onChange={() => setShowCopyDialog(true)}
                  />
                }
                label="Apply Sunday Slot to All Days"
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
                  <AddCircleOutlineIcon fontSize="small" />
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
                  <Divider
                    sx={{
                      margin: "0px",
                      mx: 2,
                      borderColor: "#bbdefb",
                    }}
                  />
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

      <CommonDialogBox
        open={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
        hideCancel={true}
        confirmText="OK"
        title="Missing Information"
        message="Please select at least one Service Type and Specialty before adding a slot."
        onConfirm={() => setShowWarningDialog(false)}
      />

       <CommonDialogBox
        open={showCopyDialog}
        onClose={() => setShowCopyDialog(false)}
        onConfirm={confirmCopy}
        title="Apply Changes?"
        message="Do you want to copy Sunday's slots to all days?"
        confirmText="Yes"
        cancelText="No"
      />
    </LocalizationProvider>
  );
}
