// commonStyles.js
export const commonShadow = {
  width: "100%",
  mt: 1,
   ".MuiOutlinedInput-input": { display: "none" },
  ".MuiPickersInputBase-root": {
    borderRadius: 5,
    boxShadow:
      "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
    height: "53px",
  },
};

import { styled } from "@mui/material/styles";

export const StyledDatePickerWrapper = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  gap: theme.spacing(3),
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",

  ".MuiSvgIcon-root": {
    height: "0.65em",
    width: "0.65em",
  },

  ".MuiButtonBase-root": {
    margin: "-13px",
    padding: "8px",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },

  ".MuiPickersInputBase-root": {
    borderRadius: 5,
    boxShadow:
      "inset 4px 2px 8px rgba(95, 157, 231, 0.48), inset -4px -2px 8px #fff",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

export const timePickarStyle = {
  mt: 0.5,
  gap: 3,
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  ".MuiPickersInputBase-root": {
    width: "136px",
    boxShadow:
      "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
    borderRadius: 5,
    height: "40px",
  },
};


