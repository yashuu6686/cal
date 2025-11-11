export const calendarStyles = {
  p: 3,
  borderRadius: 4,
  "& .rbc-calendar": {
    backgroundColor: "transparent",
  },
  "& .rbc-header": {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "16px 8px",
    borderBottom: "2px solid #90caf9",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  "& .rbc-today": {
    backgroundColor: "#f0f7ff",
  },
  "& .rbc-time-slot": {
    borderTop: "1px solid #e3f2fd",
  },
  "& .rbc-time-column": {
    "& .rbc-timeslot-group": {
      borderLeft: "2px solid #e3f2fd",
    },
  },
  "& .rbc-current-time-indicator": {
    backgroundColor: "#1976d2",
    height: 3,
  },
  "& .rbc-day-slot .rbc-time-slot": {
    borderTop: "1px solid #f0f7ff",
  },
  "& .rbc-time-header-content": {
    borderLeft: "2px solid #e3f2fd",
  },
  "& .rbc-toolbar": {
    backgroundColor: "#e3f2fd",
    padding: "16px 20px",
    borderRadius: "12px",
    marginBottom: "24px",
    border: "2px solid #90caf9",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
    "& button": {
      color: "#1976d2",
      fontWeight: 600,
      fontSize: "0.9rem",
      padding: "8px 20px",
      borderRadius: "10px",
      border: "2px solid transparent",
      transition: "all 0.3s ease",
      backgroundColor: "white",
      marginLeft: "8px",
      "&:hover": {
        backgroundColor: "#1976d2",
        color: "white",
        border: "2px solid #1565c0",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
      },
      "&.rbc-active": {
        backgroundColor: "#1976d2",
        color: "white",
        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
        border: "2px solid #1565c0",
      },
    },
    "& .rbc-toolbar-label": {
      color: "#1565c0",
      fontWeight: 700,
      fontSize: "1.3rem",
      letterSpacing: "0.5px",
    },
  },
  "& .rbc-event-label": {
    display: "none",
  },
  "& .rbc-day-bg": {
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#f8fbff",
    },
  },
};