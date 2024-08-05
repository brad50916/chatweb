import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import { getMessages, getToUserId } from "./Api.jsx";
import { getAvatar, getUserInfo } from "./Api.jsx";
import ViewProfile from "./ViewProfile.jsx";

export default function ChatContent({
  UserId,
  currentChatId,
  socket,
  messages,
  setMessages,
  chatReloadTrigger,
}) {
  const [input, setInput] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [toUserAvatar, setToUserAvatar] = useState(null);
  const boxRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [userProfile, setUserProfile] = useState(null);
  const [toUserProfile, setToUserProfile] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const handleSendClick = () => {
    const messageData = {
      type: "textMessage",
      userId: UserId,
      currentChatId: currentChatId,
      text: input,
      toUserId: toUserId,
    };
    socket.emit("sendMessage", messageData);
    setInput("");
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };
  useEffect(() => {
    const fetchChatRoomData = async () => {
      try {
        const result = await getMessages(currentChatId);
        if (result) {
          setMessages(result);
        } else {
          console.log("No messages found");
        }
      } catch (error) {
        console.error("Error finding message:", error);
      }
    };

    const fetchToUserId = async () => {
      try {
        const result = await getToUserId(currentChatId, UserId);
        if (result) {
          setToUserId(result);
        } else {
          console.log("No toUserId found");
        }
      } catch (error) {
        console.error("Error finding message:", error);
      }
    };

    const fetchUserAvatar = async () => {
      try {
        const result = await getAvatar(UserId);
        setUserAvatar(result);
      } catch (error) {
        console.error("Error finding avatar:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const result = await getUserInfo(UserId);
        setUserProfile(result);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchChatRoomData();
    fetchToUserId();
    fetchUserAvatar();
    fetchUserProfile();
  }, [currentChatId, chatReloadTrigger]);

  useEffect(() => {
    const fetchToUserAvatar = async () => {
      try {
        const result = await getAvatar(toUserId);
        setToUserAvatar(result);
      } catch (error) {
        console.error("Error finding avatar:", error);
      }
    };
    const fetchToUserProfile = async () => {
      try {
        const result = await getUserInfo(toUserId);
        setToUserProfile(result);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchToUserAvatar();
    fetchToUserProfile();
  }, [toUserId]);

  return (
    <Container
      sx={{
        height: "100vh",
        width: "100wh",
        ml: 2,
        mr: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        ref={boxRef}
        sx={{
          border: "1px solid #c2c2d6",
          flexGrow: 1,
          overflow: "auto",
          mt: 10,
          borderRadius: 1,
        }}
      >
        {messages.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                item.sender_id === UserId ? "flex-end" : "flex-start",
              p: 1,
            }}
          >
            {item.sender_id !== UserId && (
              <Avatar
                src={toUserAvatar}
                alt="avatar"
                sx={{ width: 40, height: 40, marginRight: 2 }}
                onClick={() => {
                  setSelectedUser(toUserProfile);
                  setOpen(true);
                }}
              />
            )}
            <Paper elevation={3} sx={{ p: 2, m: 2, maxWidth: "70%" }}>
              {item.content}
            </Paper>
            {item.sender_id === UserId && (
              <Avatar
                src={userAvatar}
                alt="avatar"
                sx={{ width: 40, height: 40, marginLeft: 2 }}
                onClick={() => {
                  setSelectedUser(userProfile);
                  setOpen(true);
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 2, bottom: 0 }}>
        <TextField
          label="Input"
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendClick}
        >
          Send
        </Button>
      </Stack>
      <ViewProfile
        startChat={false}
        open={open}
        handleClose={handleClose}
        selectedUser={selectedUser}
        handleChat={null}
      />
    </Container>
  );
}
