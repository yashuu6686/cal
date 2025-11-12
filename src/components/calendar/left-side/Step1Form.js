import React, { useState, useEffect } from "react";
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
    selectedSpecialities,
    isCalendarPublished,
    isEditMode,
    isFieldsDisabled,
  } = useCalendarState();

  const [showSlotError, setShowSlotError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const initialValues = { weekSchedule };

  useEffect(() => {
    if (
      showSlotError &&
      selectedServices.length > 0 &&
      selectedSpecialities.length > 0
    ) {
      setShowSlotError(false);
    }
  }, [selectedServices, selectedSpecialities, showSlotError]);

  const handleFormSubmit = (values, formikBag) => {
  
    weekSchedule.forEach((day, index) => {
      console.log(`Day ${index} (${day.day}):`, {
        hasSlots: day.slots ? 'YES' : 'NO',
        slotsLength: day.slots?.length || 0,
        slots: day.slots
      });
    });
    

    const hasSlot = weekSchedule.some(
      (day) => day.slots && day.slots.length > 0
    );
    


    if (selectedServices.length === 0) {
      setErrorMessage("At least one service is required.");
      setShowSlotError(true);
      formikBag.setSubmitting(false);
      return;
    }

    if (selectedSpecialities.length === 0) {
      setErrorMessage("At least one specialty is required.");
      setShowSlotError(true);
      formikBag.setSubmitting(false);
      return;
    }

    if (!hasSlot) {
      setErrorMessage(
        "Please add at least one time slot for the selected service type before publishing."
      );
      setShowSlotError(true);
      formikBag.setSubmitting(false);
      return;
    }

    // Pass Redux weekSchedule to onSubmit instead of Formik values
    onSubmit({ weekSchedule }, formikBag);
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
        {({ isSubmitting, errors, touched, values, submitForm }) => (
          <Form>
            <Box>
              {/* Header */}
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
                <Typography
                  variant="h5"
                  sx={{ color: "white", fontWeight: 200 }}
                >
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

              {/* Service Type Section */}
              <ServiceTypeSection
                disabled={isFieldsDisabled}
                onAddService={onOpenAddService}
              />

              <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

              {/* Specialities Section */}
              <SpecialitiesSection disabled={isFieldsDisabled} />

              <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />

              {/* Working Plan View */}
              <WorkingPlanView
                disabled={isFieldsDisabled}
                errors={errors}
                touched={touched}
              />
            </Box>

            {/* Next Button */}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
              {(!isCalendarPublished || isEditMode) && (
                <Button
                  type="button"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    // ✅ FIXED: Call handleFormSubmit with proper formikBag
                    handleFormSubmit(
                      { weekSchedule }, // Use Redux state
                      { setSubmitting: () => {} }
                    );
                  }}
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
        onConfirm={() => setShowSlotError(false)}
        title="Error"
        message={errorMessage}
        confirmText="Got it"
        confirmColor="primary"
        hideCancel={true}
      />
    </>
  );
};

export default Step1Form;