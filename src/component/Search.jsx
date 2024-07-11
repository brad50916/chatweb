import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function SearchBar({ UserId, setCurrentChatId }) {
  const [username, setUsername] = useState("");
  const [userdata, setUserdata] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (username && username.length > 0) {
        try {
          const response = await fetch(
            `http://localhost:5001/search?username=${username}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUserdata(data);
          //   console.log(data.id);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [username]);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleOptionSelect = (event, value) => {
    if (!value) {
      return;
    }
    setSelectedUser(value);
    setOpen(true);
    setValue(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChat = async () => {
    try {
      const response = await fetch("http://localhost:5001/getChatRoomId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: UserId,
          friend_id: selectedUser.id,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message, data.chatId);
        setCurrentChatId(data.chatId);
        // Redirect to chat page
      } else {
        const data = await response.json();
        console.log(data.message, data.chatId);
        setCurrentChatId(data.chatId);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
    setOpen(false);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={userdata}
        getOptionLabel={(option) => option.username}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search..."
            onChange={handleInputChange}
          />
        )}
        onChange={handleOptionSelect}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        TransitionComponent={Fade}
        maxWidth="sm" // optional, adjust as per your design
        fullWidth // optional, adjust as per your design
      >
        <Box sx={{ p: 4 }}>
          {selectedUser && (
            <>
              <DialogTitle id="transition-modal-title">User Info</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Username: {selectedUser.username}
                </Typography>
                <Typography variant="body1">
                  Email: {selectedUser.email}
                </Typography>
                {/* Add more user details as needed */}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleChat} color="primary">
                  Start chatting
                </Button>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
