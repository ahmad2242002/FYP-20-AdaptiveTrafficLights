import ApexCharts from "../../components/livechart";
import React, { useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import io from "socket.io-client";
import { Snackbar } from "@mui/material";
export default function Settings() {
  const [mode, setMode] = React.useState("Clockwise");
  const [rows, setrows] = useState([]);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState({
    message: "",
    type: "success",
    open: false,
  });
  async function fetchMod() {
    try {
      const response = await fetch("http://169.254.220.186:5000/get_phase", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch timer data");
      }
      const data = await response.json();
      setMode(data.phase);
    } catch (error) {
      console.error("Error fetching timer data:", error.message);
    }
  }

  async function fetchCount() {
    try {
      const response = await fetch("http://169.254.220.186:5000/get_camera_count", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch camera count data");
      }
      const data = await response.json();
      setCameraCount(data.count);
    } catch (error) {
      console.error("Error fetching timer data:", error.message);
    }
  }



  const handleChange = (e) => {
    if(e.target.value === 'Split-Phase')
    {
      SetSplit()
    }
    else if(e.target.value === 'Clockwise')
    {
      SetReverse()
    }
    else if(e.target.value === 'Anti-Clockwise')
    {
      setNormal()
    }
    setMode(e.target.value);
  };

  const [cameraCount, setCameraCount] = React.useState("4");

  const handleChangeCamera = (e) => {
    setCamera(e.target.value);
    setCameraCount(e.target.value);
  };

  useEffect(() => {
    GetUserData();
    fetchMod();
    fetchCount();
  }, []);

  async function GetUserData() {
    try {
      const response = await fetch("http://localhost:3000/api/userdata");

      const data = await response.json();

      if (data) {
        setrows(data[0]);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error Getting UserData:", error);
    }
  }

  async function changeRole(email, role) {
    try {
      const response = await fetch("http://localhost:3000/api/updaterole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, role: role }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error changing Role:", error);
    }
  }
  const handleRoleChange = (event, email, index) => {
    const updatedRows = [...rows];
    updatedRows[index].role = event.target.value;
    setrows(updatedRows);
    setRole(event.target.value);
    changeRole(email, event.target.value);
  };


  async function SetReverse() {
    setIsLoading(true)
    try {
      const response = await fetch("http://169.254.220.186:5000/set_reverse", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setIsLoading(false)
        throw new Error("Failed to change to Reverse");
      }
      else
      {
        setIsLoading(false)
        alert('alert change to reverse')
      }
    } catch (error) {
      console.error("Error change to reverse:", error.message);
    }
  }

  async function SetSplit() {
    setIsLoading(true)
    try {
      const response = await fetch("http://169.254.220.186:5000/set_split_phasing", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        setIsLoading(false)
        throw new Error("Failed to change to SetSplit");
      }
      else
      {
        setTimeout(() => {
          setAlerts({
            ...alerts,
            message: data.error,
            type: "success",
            open: true,
          });
        }, 2000);
      
        setIsLoading(false)

      }
    } catch (error) {
      console.error("Error change to SetSplit:", error.message);
    }
  }
  async function setNormal() {
    setIsLoading(true)
    try {
      const response = await fetch("http://169.254.220.186:5000/set_normal", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setIsLoading(false)
        throw new Error("Failed to change to Normal");
      }
      else
      {
        setIsLoading(false)
        alert('alert change to Normal')
      }
    } catch (error) {
      console.error("Error change to Normal:", error.message);
    }
  }

  async function setCamera(count) {
    setIsLoading(true)
      const response = await fetch("http://169.254.220.186:5000/change_no_camera", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          no_of_camera: count,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          setMode(1);
          return response.json();
        })
        .then((data) => {
          setIsLoading(false);
          console.log(data.message); // Log the response message
          // You can perform additional actions with the received data here
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("There was a problem with the fetch operation:", error);
        });
  }
  const handleClose = () => {
    setAlerts({ ...alerts, message: "", open: false, type: "success" });
  };

  return (
    <div className="  justify-center w-full p-10 grid grid-cols-3">
     {isLoading ? (
      <div className=" flex m-7 px-10 py-20 bg-white h-1/3 rounded-lg drop-shadow-lg justify-center">
        <div className=" flex items-center text-center justify-center space-x-3 bg-teal-300 p-4 rounded-xl ">
          <div className="processing-spinner"></div>
          <p className=" text-xl font-bold">Changing Mod</p>
        </div>
      </div>
      ) : (
      <div className=" flex flex-col m-7 bg-white h-1/3 rounded-lg drop-shadow-lg">
      <h1 className=" text-black m-2 font-bold ">Update Modes</h1>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel
            sx={{
              color: "rgba(75, 192, 192, 1)",
              "&.Mui-focused": {
                color: "rgba(75, 192, 192, 1)",
              },
            }}
            id="demo-simple-select-autowidth-label"
          >
            Signal Mode
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={mode}
            onChange={handleChange}
            label="Signal Mode"
            sx={{
              color: "black",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(75, 192, 192, 1)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(75, 192, 192, 1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(75, 192, 192, 1)",
              },
              ".MuiSvgIcon-root ": {
                fill: "rgba(75, 192, 192, 1) !important",
              },
            }}
          >
            <MenuItem value={"Clockwise"}>Clockwise</MenuItem>
            <MenuItem value={"Anti-Clockwise"}>Anti-Clockwise</MenuItem>
            <MenuItem value={"Split-Phase"}>Split-Phase</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel
            sx={{
              color: "rgba(75, 192, 192, 1)",
              "&.Mui-focused": {
                color: "rgba(75, 192, 192, 1)",
              },
            }}
            id="demo-simple-select-autowidth-label"
          >
            No of Cameras
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={cameraCount}
            onChange={handleChangeCamera}
            label="Signal Mode"
            sx={{
              color: "black",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(75, 192, 192, 1)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(75, 192, 192, 1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(75, 192, 192, 1)",
              },
              ".MuiSvgIcon-root ": {
                fill: "rgba(75, 192, 192, 1) !important",
              },
            }}
          >
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </FormControl>
        </div>)
     }
        <div className=" p-5 col-span-2">
        <div className="  space-y-2 bg-white h-1/3 rounded-lg drop-shadow-lg">
          <h1 className=" text-black font-bold m-4">Traffic Analyzer User Data</h1>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Cnic</TableCell>
                  <TableCell align="center">Update Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.role}</TableCell>
                    <TableCell align="center">{row.cnic}</TableCell>
                    <TableCell align="center">
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          defaultValue={row.role}
                          onChange={(event) =>
                            handleRoleChange(event, row.email, index)
                          }
                          sx={{
                            color: "black",
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(75, 192, 192, 1)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(75, 192, 192, 1)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(75, 192, 192, 1)",
                            },
                            ".MuiSvgIcon-root ": {
                              fill: "rgba(75, 192, 192, 1) !important",
                            },
                          }}
                        >
                          <MenuItem value={"admin"}>admin</MenuItem>
                          <MenuItem value={"analyzer"}>analyzer</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Snackbar
        open={alerts.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alerts.type}
          sx={{ width: "100%" }}
        >
          {alerts.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
