import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsEditMode } from "@/redux/store/slices/calendarSlice";
import { workingPlanSchema } from "@/components/calendar/validation/validation";
import { useCalendarState } from "@/hook/useCalendarState";
import ServiceTypeSection from "./ServiceTypeSection";
import SpecialitiesSection from "./SpecialitiesSection";
import WorkingPlanView from "@/components/calendar/left-side/WorkingPlanView";
import CommonDialogBox from "@/components/CommonDialogBox";

const Step1Form = ({ onSubmit, onOpenAddService }) => {
  const dispatch = useDispatch();

  const {
  
    isCalendarPublished,
    isEditMode,
    isFieldsDisabled,
  } = useCalendarState();


  const {calendar} = useSelector(state=>state.calendar);

  const [showSlotError, setShowSlotError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleFormSubmit = (values, formikBag) => {
    // Check 1: Services required
     if (!calendar?.services || calendar.services.length === 0) {
      setErrorMessage("At least one service is required.");
      setShowSlotError(true);
      formikBag.setSubmitting(false);
      return;
    }

    // Check 2: Specialities required
    if (!calendar?.specialties || calendar.specialties.length === 0) {
      setErrorMessage("At least one specialty is required.");
      setShowSlotError(true);
      formikBag.setSubmitting(false);
      return;
    }

    if (!calendar?.availability ||  calendar.availability.length === 0) {
      setErrorMessage(
        "Please add at least one time slot for the selected service type before publishing."
      );
      setShowSlotError(true);
      formikBag.setSubmitting(false);
      return;
    }

    // All checks passed, proceed
    onSubmit(values, formikBag);
  };

  return (
    <>
      <Formik

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
                  p: 0.6,
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
                  sx={{ textTransform: "none" }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Form>
        )}
      </Formik>

     
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