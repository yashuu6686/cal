import { Button } from "@mui/material";
import Image from "next/image";
import React from "react";

function CommonButton(props) {
  return (
    <Button
      isSelected={props.isSelected}
      onClick={props.onClick}
      disabled={props.disabled}
      sx={{
        ...props.sx,
        width: "105px",
        height: "65px",
        m: "3px",
        padding: "10px !important ",
        // minWidth:"100px",
        // mt: "5px",
        display: "flex",
        flexDirection: "column",
        borderRadius:"7px",
        color:props.isSelected ? "white" : "",
        backgroundColor:props.isSelected ? "#1172BA" : "",
        border: props.isSelected
          ? ""
          : "1px solid #1172ba80",
           transition: "all 0.15s ease",

        boxShadow: props.isSelected
          ? "rgba(0, 0, 0, 0.1) 0px 6px 12px"
          : "none",
        "&.Mui-disabled": {
          border: "2px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      {props.src && (
        <Image
          src={props.src}
          width={30}
          height={25}
           style={{
    objectFit: "contain",
    filter: props.isSelected ? "brightness(-0) invert(1)" : "none",
  }}
          alt={props.text || "button"}
        />
      )}
      {props.children}
    </Button>
  );
}

export default CommonButton;
