import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function MainListItems({
  chatRoomData,
  UserId,
  setCurrentChatId,
  setChatReloadTrigger,
}) {
  const fetchUserName = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/getUserName?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Error finding message:", error);
    }
    return null;
  };

  return (
    <Box sx={{ overflow: "auto", height: 380 }}>
      {chatRoomData.map((item, index) => {
        const [user1Username, setUser1Username] = useState("");
        const [user2Username, setUser2Username] = useState("");

        const getUserNames = async () => {
          const user1 = await fetchUserName(item.user1_id);
          const user2 = await fetchUserName(item.user2_id);
          setUser1Username(user1);
          setUser2Username(user2);
        };
        getUserNames();

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
              <ListItemText primary={user2Username} />
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
            <ListItemText primary={user1Username} />
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
      <ListItemButton onClick={() => navigate("/profile")}>
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
