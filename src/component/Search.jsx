import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useState, useEffect} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

export default function () {
    const [username, setUsername] = useState('');
    const [userdata, setUserdata] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          if (username) {
            try {
              const response = await fetch(`http://localhost:5001/search?username=${username}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              setUserdata(data);
            //   console.log(data.id);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          } else {
            console.log('user not found');
            setUserdata([]);
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
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Box sx={{ width: 300 }}>
            <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={userdata}
                getOptionLabel={(option) => option.username}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label="Search..." 
                        onChange={handleInputChange} 
                    />
                )}
                onChange={handleOptionSelect}
            />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box 
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        {selectedUser && (
                            <>
                                <Typography id="transition-modal-title" variant="h6" component="h2">
                                    User Info
                                </Typography>
                                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                    Username: {selectedUser.username}
                                </Typography>
                                <Typography id="transition-modal-description" sx={{ mt: 1 }}>
                                    Email: {selectedUser.email}
                                </Typography>
                                {/* Add more user details as needed */}
                                <Button onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
}