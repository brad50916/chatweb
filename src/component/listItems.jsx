import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Box from "@mui/material/Box";

export function MainListItems({ chatRoomData, UserId, setCurrentChatId }) {
  return (
    <Box sx={{ overflow: "auto", height: 280 }}>
      {chatRoomData.map((item, index) => {
        if (item.user1_id === UserId) {
          return (
            <ListItemButton
              key={index}
              onClick={() => setCurrentChatId(item.chat_id)}
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
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
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
