import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MainListItems, SecondaryListItems } from "./listItems";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Search";
import ChatContent from "./ChatContent";
import { SocketContext } from "./SocketContext";

const drawerWidth = 240;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    padding: "0 4px",
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#9494b8",
    },
  },
});

export default function Dashboard() {
  const navigate = useNavigate();

  const [UserId, setUserId] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatRoomData, setChatRoomData] = useState([]);
  const [messages, setMessages] = useState([]);

  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5001/verify", {
            headers: {
              Authorization: token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            console.log("token authenticated successfully");
            setUserId(data.userId);
          } else {
            navigate("/signin");
          }
        } catch (error) {
          navigate("/signin");
        }
      } else {
        navigate("/signin");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (UserId) {
      socket.emit("register", UserId);
      const handleReceiveMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [UserId]);

  useEffect(() => {
    const fetchAllChatRoomData = async () => {
      if (UserId) {
        try {
          const response = await fetch(
            `http://localhost:5001/getAllChatRoomData?userId=${UserId}`
          );
          if (response.ok) {
            const data = await response.json();
            setChatRoomData(data);
          } else {
            const data = await response.json();
            console.log(data);
          }
        } catch (error) {
          console.error("Error finding chat room ID:", error);
        }
      }
    };
    fetchAllChatRoomData();
  }, [UserId]);

  const logout = () => {
    localStorage.removeItem("token");
    if (socket) {
      socket.disconnect();
    }
    navigate("/signin");
  };

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <SearchBar UserId={UserId} setCurrentChatId={setCurrentChatId} />
            <IconButton color="inherit">
              <StyledBadge badgeContent={5} color="primary">
                <NotificationsIcon />
              </StyledBadge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems
              chatRoomData={chatRoomData}
              UserId={UserId}
              setCurrentChatId={setCurrentChatId}
            />
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems onClickHandler={logout} />
          </List>
        </Drawer>
        {currentChatId ? (
          <ChatContent
            UserId={UserId}
            currentChatId={currentChatId}
            socket={socket}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
            }}
          >
            <Typography variant="h5" component="div">
              Welcome! Please select a chat to start messaging.
            </Typography>
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
}
