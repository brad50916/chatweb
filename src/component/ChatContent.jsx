import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextInput from "./TextInput";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";

export default function ChatContent({ UserId, currentChatId }) {
  const data = new Array(10).fill("hello");
  data[0] = UserId;
  data[1] = currentChatId;
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
        sx={{
          border: "1px solid #c2c2d6",
          flexGrow: 1,
          overflow: "auto",
          mt: 10,
          borderRadius: 1,
        }}
      >
        {data.map((item, index) => (
          <Paper key={index} elevation={1} sx={{ p: 2, m: 2, width: 100 }}>
            {item}
          </Paper>
        ))}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 2, bottom: 0 }}>
        <TextInput text="Input" />
        <Button variant="contained" endIcon={<SendIcon />}>
          Send
        </Button>
      </Stack>
    </Container>
  );
}
