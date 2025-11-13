// BreakDialog.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDialog } from "@/redux/store/slices/calendarSlice";
import BreakTable from "@/components/calendar/right-side/TableBreak";
import CommonDataDialog from "@/components/CommonDataDialog";

export default function BreakDialog() {
  const dispatch = useDispatch();
  const openDialog = useSelector((state) => state.calendar.openDialog);
  const breaks = useSelector((state) => state.calendar.breaks);

  return (
    <CommonDataDialog
      open={openDialog}
      onClose={() => dispatch(setOpenDialog(false))}
      title="Break Details"
      data={breaks}
      TableComponent={BreakTable}
      emptyIcon="☕"
      emptyMessage="No breaks scheduled"
      emptySubtext="Select days and times to add break schedules"
    />
  );
}