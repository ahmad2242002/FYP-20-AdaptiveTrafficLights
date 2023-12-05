import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Dialog from "@mui/material/Dialog";
import { DialogContentText, TextField } from "@mui/material";

export default function OTPConfirm({ setConfirmOtp,fourDigitCode,showOtp, setShowOtp }) {
  const [otp, setOTP] = useState(["", "", "", ""]);
 
  const handleInputChange = (index, value) => {
    if (value.match(/^\d*$/) && value.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
    }
  };

  const handleOk = () => {
    const mergedOTP = otp.join('');
    if(mergedOTP === fourDigitCode)
    {
      setConfirmOtp(true)
      setShowOtp(false);
    }
    else
    {
      setConfirmOtp(false)
    }
    console.log("Confirmed OTP:", otp.join(""));
  };

  

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "85%",
          height: "auto",
          backgroundColor: "#A6E3E9",
          borderRadius: "10px",
        },
      }}
      maxWidth="xs"
      open={showOtp}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Confirm OTP</DialogTitle>
      <DialogContent
        dividers
        sx={{
          display: "block",
          justifyContent: "center",
          backgroundColor: "#CBF1F5",
        }}
      >
        <DialogContentText
          sx={{ marginBottom: "10px", marginX: "4px", fontWeight: "bold" }}
        >
          Enter the OPT Code Sent to the Mail
        </DialogContentText>
        <Box
          marginTop="20px"
          display="flex"
          flexDirection="row"
          alignItems="center"
          textAlign="center"
          justifyItems="center"
        >
          {otp.map((digit, index) => (
            <TextField
              key={index}
              variant="outlined"
              margin="dense"
              type="text"
              sx={{ margin: "0 4px", width: "25%", backgroundColor: "white" }}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center" },
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <button
          className=" w-20 h-10 mx-1 text-base font-medium rounded-lg hover:scale-110 focus:scale-90 hover:bg-[#CBF1F5] bg-slate-100"
          onClick={() => {
            setShowOtp(false);
          }}
        >
          Cancel
        </button>
        <button
          className=" w-20 h-10 mx-1 text-base font-medium rounded-lg hover:scale-110 focus:scale-90 hover:bg-[#CBF1F5] bg-slate-100"
          onClick={() => handleOk(otp.join(""))}
        >
          Confirm
        </button>
      </DialogActions>
    </Dialog>
  );
}
