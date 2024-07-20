import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Box from "@mui/material/Box";
import { useNavigate } from 'react-router-dom';

export function MainListItems({
  chatRoomData,
  UserId,
  setCurrentChatId,
  setChatReloadTrigger,
}) {
  return (
    <Box sx={{ overflow: "auto", height: 380 }}>
      {chatRoomData.map((item, index) => {
        if (item.user1_id === UserId) {
          return (
            <ListItemButton
              key={index}
              onClick={() => {
                setCurrentChatId(item.chat_id);
                setChatReloadTrigger((prev) => !prev);
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={item.user2_id} />
            </ListItemButton>
          );
        }
        return (
          <ListItemButton
            key={index}
            onClick={() => setCurrentChatId(item.chat_id)}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={item.user1_id} />
          </ListItemButton>
        );
      })}
    </Box>
  );
}

export function SecondaryListItems({ onClickHandler }) {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      {/* <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader> */}
      <ListItemButton onClick={() => navigate('/profile')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Setting" />
      </ListItemButton>
      <ListItemButton onClick={onClickHandler}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
}
