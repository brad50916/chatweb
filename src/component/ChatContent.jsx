import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
// import TextInput from "./TextInput";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";

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
  const boxRef = useRef(null);
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
      toUserId: toUserId
    };
    socket.emit("sendMessage", messageData);
    setInput("");
  };

  useEffect(() => {
    const fetchChatRoomData = async () => {
      if (currentChatId) {
        try {
          const response = await fetch(
            `http://localhost:5001/getMessage?chatId=${currentChatId}`
          );
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
            const data = await response.json();
            console.log(data);
          }
        } catch (error) {
          console.error("Error finding message:", error);
        }
      }
    };
    const fetchToUserId = async () => {
      if (currentChatId) {
        try {
          const response = await fetch(
            `http://localhost:5001/getToUserId?chatId=${currentChatId}&userId=${UserId}`
          );
          if (response.ok) {
            const data = await response.json();
            setToUserId(data);
          } else {
            const data = await response.json();
            console.log(data);
          }
        } catch (error) {
          console.error("Error finding message:", error);
        }
      }
    };
    fetchChatRoomData();
    fetchToUserId();
  }, [currentChatId, chatReloadTrigger]);

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
          <Paper key={index} elevation={1} sx={{ p: 2, m: 2, width: 100 }}>
            {item.content}
          </Paper>
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
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendClick}
        >
          Send
        </Button>
      </Stack>
    </Container>
  );
}
