import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setIsEditMode } from "@/redux/store/slices/calendarSlice";
import { workingPlanSchema } from "@/components/calendar/validation/validation";
import { useCalendarState } from "@/hook/useCalendarState";
import ServiceTypeSection from "./ServiceTypeSection";
import SpecialitiesSection from "./SpecialitiesSection";
import WorkingPlanView from "@/components/calendar/right-side/WorkingPlanView";
import CommonDialogBox from "@/components/CommonDialogBox";

const Step1Form = ({ onSubmit, onOpenAddService }) => {
  const dispatch = useDispatch();

  const {
    weekSchedule,
    selectedServices,
    isCalendarPublished,
    isEditMode,
    isFieldsDisabled,
  } = useCalendarState();

  const [showSlotError, setShowSlotError] = useState(false);

  const initialValues = { weekSchedule };

 const handleFormSubmit = (values, formikBag) => {
  const hasSlot = values.weekSchedule.some(
    (day) => day.slots && day.slots.length > 0
  );
  

  if (!hasSlot) {
    setShowSlotError(true);
    formikBag.setSubmitting(false); 
    return;
  }

  onSubmit(values, formikBag);
};

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          try {
            workingPlanSchema.validateSync(values, {
              abortEarly: false,
              context: { selectedServices },
            });
            return {};
          } catch (err) {
            const errors = {};
            if (err.inner) {
              err.inner.forEach((error) => {
                if (error.path) errors[error.path] = error.message;
              });
            }
            return errors;
          }
        }}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values }) => (
          <Form>
            <Box>
              <Box
                sx={{
                  background: "#1172BA",
                  p: 1,
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

              <ServiceTypeSection
                disabled={isFieldsDisabled}
                onAddService={onOpenAddService}
              />

              <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

              <SpecialitiesSection disabled={isFieldsDisabled} />

              <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

              <WorkingPlanView
                disabled={isFieldsDisabled}
                errors={errors}
                touched={touched}
              />
            </Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
              {(!isCalendarPublished || isEditMode) && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              )}
            </Box>
          </Form>
        )}
      </Formik>

      {/* Error Dialog */}
     <CommonDialogBox
  open={showSlotError}
  onClose={() => setShowSlotError(false)}
  onConfirm={() => {
    setShowSlotError(false);
    // Optionally scroll to or highlight the Working Plan section
  }}
  title="Missing Service Slots"
  message="Please add at least one service slot in the Working Plan before continuing."
  confirmText="Got it"
  confirmColor="primary"
  hideCancel={true}
/>
    </>
  );
};

export default Step1Form;
