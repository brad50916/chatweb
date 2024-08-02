import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
// import TextInput from "./TextInput";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import { getMessages, getToUserId } from "./Api.jsx";
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
      toUserId: toUserId,
    };
    socket.emit("sendMessage", messageData);
    setInput("");
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendClick();
    }
  };
  useEffect(() => {
    const fetchChatRoomData = async () => {
      if (currentChatId) {
        try {
          const result = await getMessages(currentChatId);
          if (result) {
            setMessages(result);
          } else {
            console.log('No messages found');
          }
        } catch (error) {
          console.error("Error finding message:", error);
        }
      }
    };
    const fetchToUserId = async () => {
      if (currentChatId) {
        try {
          const result = await getToUserId(currentChatId, UserId);
          if (result) {
            setToUserId(result);
          } else {
            console.log('No toUserId found');
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
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: item.sender_id === UserId ? 'flex-end' : 'flex-start',
              p: 1,
            }}
          >
            <Paper
              elevation={3}
              sx={{ p: 2, m: 2, maxWidth: '70%' }}
            >
              {item.content}
            </Paper>
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
    </Container>
  );
}