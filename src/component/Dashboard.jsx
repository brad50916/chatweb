import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, SecondaryListItems } from './listItems';
import TextInput from './TextInput';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const data = new Array(10).fill('hello');

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    padding: '0 4px',
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#9494b8',
    },
  },
});


export default function Dashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        // Here, you can add a function to verify the token from the server if needed
        setIsAuthenticated(true);
    } else {
      navigate('/signin');
    }
  }, [isAuthenticated]);

  const logout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
  };
  
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems onClickHandler={logout} />
            {/* {secondaryListItems} */}
          </List>
        </Drawer>
        <Container sx={{
              height: '100vh',
              width: '100wh',
              ml: 2,
              mr: 2,
              display: "flex",
              flexDirection: "column",
            }}>
          <Box sx={{ border: '1px solid #c2c2d6', flexGrow: 1, overflow: 'auto', mt: 10, borderRadius: 1}}>
            {/* <Paper elevation={1} sx={{ p: 2, m: 2, width: 100}}>
              hello
            </Paper> */}
            {data.map((item, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, m: 2, width: 100 }}>
                {item}
              </Paper>
            ))}

          </Box>

          <Stack direction="row" spacing={1} sx={{mt:2, mb:2, bottom: 0}}>
            <TextInput text="Input"/>
            <Button variant="contained" endIcon={<SendIcon />}>
              Send
            </Button>
          </Stack>

        </Container>
      </Box>
    </ThemeProvider>
  );
}
