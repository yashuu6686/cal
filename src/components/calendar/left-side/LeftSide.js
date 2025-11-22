"use client";
import React, { useState } from "react";
import { Paper, Box } from "@mui/material";
import LoadingOverlay from "./LoadingOverlay";
import ErrorAlert from "./ErrorAlert";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import AddServiceDialog from "./AddServiceDialog";

import { useCalendarState } from "@/hook/useCalendarState";
import { useCalendarAPI } from "@/hook/useCalendarAPI ";

function LeftSide() {
  const [step, setStep] = useState(1);
  const [openAddService, setOpenAddService] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { isLoading, apiError, isCalendarPublished } = useCalendarState();

  const { handleStep1Submit, handleStep2Submit, handleAddServiceSubmit } =
    useCalendarAPI(setStep);

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
          <Step1Form
            onSubmit={handleStep1Submit}
             goNext={() => setStep(2)}  
            onOpenAddService={() => setOpenAddService(true)}
          />
        )}

        {step === 2 && (
          <Step2Form onSubmit={handleStep2Submit} onBack={() => setStep(1)} />
        )}
      </Box>

      <AddServiceDialog
        open={openAddService}
        onClose={() => setOpenAddService(false)}
        onSubmit={handleAddServiceSubmit}
      />
    </Paper>
  );
}

export default LeftSide;
