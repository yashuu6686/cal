import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Divider } from "@mui/material";
import { step2ValidationSchema } from "@/components/calendar/validation/validation";
import { useCalendarState } from "@/hook/useCalendarState";
import Break from "@/components/calendar/right-side/Break";
import Holiday from "@/components/calendar/right-side/Holiday";
// import { buttonGradientStyles } from "./styles";

const Step2Form = ({ onSubmit, onBack }) => {
  const {
    breakSelectedDays,
    startTime,
    endTime,
    holidayValues,
    breaks,
    holidays,
    editIndex,
    holidayEditIndex,
    isCalendarPublished,
  } = useCalendarState();

  const initialValues = {
    breakSelectedDays: breakSelectedDays || [],
    startTime: startTime || null,
    endTime: endTime || null,
    holidayDate: holidayValues?.date || null,
    holidayStartTime: holidayValues?.startTime || null,
    holidayEndTime: holidayValues?.endTime || null,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={step2ValidationSchema}
      onSubmit={onSubmit}
           validate={(values) => {
        try {
          step2ValidationSchema.validateSync(values, {
            abortEarly: false,
            context: {
              breaks,
              editIndex,
              existingHolidays: holidays,
              holidayEditIndex,
            },
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
      enableReinitialize

    >
      {({ isSubmitting, errors, touched, values, setFieldValue }) => (
        <Form>
          <Break
            errors={errors}
            touched={touched}
            values={values}
            setFieldValue={setFieldValue}
          />
          <Divider sx={{ my: 2, borderColor: "#bbdefb" }} />
          <Holiday
            errors={errors}
            touched={touched}
            values={values}
            setFieldValue={setFieldValue}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
            <Button
              variant="outlined"
              sx={{
                mr: 0.5,
                // borderRadius: 2.5,
                // fontWeight: 600,
                fontSize: "0.9rem",
                textTransform:'none'
              }}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{textTransform:'none'}}
            //   sx={buttonGradientStyles}
            >
              {isCalendarPublished ? "Update Calendar" : "Publish Calendar"}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default Step2Form;