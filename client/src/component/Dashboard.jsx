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
import { MainListItems, SecondaryListItems } from "./listItems.jsx";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Search.jsx";
import ChatContent from "./ChatContent.jsx";
import { SocketContext } from "./SocketContext.jsx";
import { verifyToken, getAllChatRoomData, getUserName } from "./Api.jsx";
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
  const [userName, setUserName] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatRoomData, setChatRoomData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatReloadTrigger, setChatReloadTrigger] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const result = await verifyToken(token);
          if (result) {
            setUserId(result);
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          navigate("/");
        }
      } else {
        navigate("/");
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
          const result = await getAllChatRoomData(UserId);
          if (result) {
            setChatRoomData(result);
          } else {
            console.log("No chat room data found");
          }
        } catch (error) {
          console.error("Error finding chat room ID:", error);
        }
      }
    };
    const fetchUserName = async () => {
      if (UserId) {
        try {
          const result = await getUserName(UserId);
          if (result) {
            setUserName(result);
          } else {
            console.log("No user name found");
          }
        } catch (error) {
          console.error("Error finding message:", error);
        }
        return null;
      }
    };
    fetchAllChatRoomData();
    fetchUserName();
  }, [UserId, currentChatId]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (socket) {
      socket.disconnect();
    }
    navigate("/");
  };

  const [open, setOpen] = useState(true);
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
            {/* <IconButton color="inherit">
              <StyledBadge badgeContent={0} color="primary">
                <NotificationsIcon />
              </StyledBadge>
            </IconButton> */}
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
              setChatReloadTrigger={setChatReloadTrigger}
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
            chatReloadTrigger={chatReloadTrigger}
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
              Welcome {userName}! Please select a chat to start messaging.
            </Typography>
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
}
