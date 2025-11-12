// import CommonCard from "@/components/CommonCard";
// import { TextField } from "@mui/material";
// import React from "react";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";

// function AdvanceBooking({ editMode }) {
//   const initialValues = {
//     AdvanceBookingDays: "15",
//     CheckInTime: "60",
//   };

//   const validationSchema = Yup.object().shape({
//     AdvanceBookingDays: Yup.string()
//       .required("This field is required")
//       .matches(/^\d+$/, "Only numbers are allowed")
//       .test(
//         "max-value",
//         "Cannot be more than 99",
//         (value) => !value || parseInt(value, 10) <= 99
//       ),
//     CheckInTime: Yup.string()
//       .required("This field is required")
//       .matches(/^\d+$/, "Only numbers are allowed")
//       .test(
//         "max-value",
//         "Cannot be more than 99",
//         (value) => !value || parseInt(value, 10) <= 99
//       ),
//   });

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       validateOnChange
//       validateOnBlur
//       // onSubmit={() => {}}
//     >
//       {({ values, errors, touched, handleChange, setFieldTouched }) => (
//         <Form>
//           <CommonCard
//             title={
//               <span
//                 style={{ display: "flex", alignItems: "center", gap: "8px" }}
//               >
//                 <AccessTimeIcon
//                   sx={{ color: "#1976d2", width: 23, height: 23 }}
//                   fontSize="small"
//                 />{" "}
//                 Advance Booking
//               </span>
//             }
//           >
//             <TextField
//               fullWidth
//               label="Advance Booking Days"
//               name="AdvanceBookingDays"
//               disabled={editMode}
//               value={values.AdvanceBookingDays}
//               onChange={(e) => {
//                 // allow only numbers and ≤ 99
//                 if (
//                   /^\d*$/.test(e.target.value) &&
//                   Number(e.target.value) <= 99
//                 ) {
//                   handleChange(e);
//                   setFieldTouched("AdvanceBookingDays", true, false);
//                 }
//               }}
//               error={
//                 touched.AdvanceBookingDays && Boolean(errors.AdvanceBookingDays)
//               }
//               helperText={
//                 touched.AdvanceBookingDays && errors.AdvanceBookingDays
//               }
//               sx={{ mt: 1 }}
//             />

//             <TextField
//               fullWidth
//               label="Check-in Time (minutes)"
//               name="CheckInTime"
//               disabled={editMode}
//               value={values.CheckInTime}
//               onChange={(e) => {
//                 if (
//                   /^\d*$/.test(e.target.value) &&
//                   Number(e.target.value) <= 99
//                 ) {
//                   handleChange(e);
//                   setFieldTouched("CheckInTime", true, false);
//                 }
//               }}
//               error={touched.CheckInTime && Boolean(errors.CheckInTime)}
//               helperText={touched.CheckInTime && errors.CheckInTime}
//               sx={{ mt: 1 }}
//             />
//           </CommonCard>
//         </Form>
//       )}
//     </Formik>
//   );
// }

// export default AdvanceBooking;
