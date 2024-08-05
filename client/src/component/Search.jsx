import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { searchUser, getChatRoomId } from "./Api.jsx";
import ViewProfile from "./ViewProfile.jsx";

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
          const result = await searchUser(username);
          if (!result) {
            console.log("No user found");
          }
          setUserdata(result);
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
      const result = await getChatRoomId(UserId, selectedUser.id);
      if (result) {
        console.log(result.message, result.chatId);
        setCurrentChatId(result.chatId);
      } else {
        console.log(result.message, result.chatId);
        setCurrentChatId(result.chatId);
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
        options={userdata || []}
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
      <ViewProfile startChat={true} open={open} handleClose={handleClose} selectedUser={selectedUser} handleChat={handleChat} />
    </Box>
  );
}
