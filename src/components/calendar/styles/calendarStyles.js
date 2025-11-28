export const  calendarStyles = {
  p: 2,
  borderRadius: 2,
  "& .rbc-calendar": {
    backgroundColor: "transparent",
  },
  "& .rbc-header": {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "8px 4px",
    borderBottom: "2px solid #90caf9",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
   "& .rbc-time-slot": {
    // borderTop: "1px solid #e3f2fd",
    minHeight: "20px !important",
    // flex: "0 0 0", 
  },
  "& .rbc-timeslot-group": {
    minHeight: "40px !important", 
  },
  "& .rbc-today": {
    backgroundColor: "#f0f7ff",
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

export const toolbarContainerStyle = {
  backgroundColor: "#e3f2fd",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: "8px 10px",
  borderRadius: "12px",
  marginBottom: "12px",
  border: "2px solid #90caf9",
  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 999,
};

export const navButtonStyle = {
  color: "#1976d2",
  fontSize: "0.9rem",
  padding: "8px 20px",
  borderRadius: "10px",
  border: "2px solid transparent",
  backgroundColor: "white",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#1976d2",
    color: "white",
    border: "2px solid #1565c0",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  },
};

export const viewButtonStyle = (active) => ({
  fontSize: "0.9rem",
  padding: "8px 16px",
  borderRadius: "10px",
  border: "2px solid transparent",
  transition: "all 0.3s ease",
  backgroundColor: active ? "#1172BA" : "white",
  color: active ? "white" : "#1976d2",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: "#1976d2",
    color: "white",
    border: "2px solid #1565c0",
    transform: "translateY(-2px)",
    // boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  },
});

export const actionButtonStyle = {
  color: "white",
  fontSize: "0.9rem",
  padding: "8px 24px",
  borderRadius: "10px",
  boxShadow:'none',
  
  textTransform: "none",
  // transition: "all 0.3s ease",
  
};



{/*
  export const calendarStyles = {
  p: 2,
  borderRadius: 4,
  "& .rbc-calendar": {
    backgroundColor: "transparent",
  },
  "& .rbc-header": {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "8px 4px",
    borderBottom: "2px solid #90caf9",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
   "& .rbc-time-slot": {
    borderTop: "1px solid #e3f2fd",
    minHeight: "20px !important", // Default 60px hoti hai
  },
  "& .rbc-timeslot-group": {
    minHeight: "40px !important", // 2 slots ka group (40px * 2)
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

export const toolbarContainerStyle = {
  backgroundColor: "#e3f2fd",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: "8px 10px",
  borderRadius: "12px",
  marginBottom: "12px",
  border: "2px solid #90caf9",
  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 999,
};

export const navButtonStyle = {
  color: "#1976d2",
  fontSize: "0.9rem",
  padding: "8px 20px",
  borderRadius: "10px",
  border: "2px solid transparent",
  backgroundColor: "white",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#1976d2",
    color: "white",
    border: "2px solid #1565c0",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  },
};

export const viewButtonStyle = (active) => ({
  fontSize: "0.9rem",
  padding: "8px 16px",
  borderRadius: "10px",
  border: "2px solid transparent",
  transition: "all 0.3s ease",
  backgroundColor: active ? "#1172BA" : "white",
  color: active ? "white" : "#1976d2",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: "#1976d2",
    color: "white",
    border: "2px solid #1565c0",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  },
});

export const actionButtonStyle = {
  color: "white",
  fontSize: "0.9rem",
  padding: "8px 24px",
  borderRadius: "10px",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
};

  */}