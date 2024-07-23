import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

const fetchAvatar = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:5001/users/${userId}/avatar`
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return url;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

const ChatListItem = ({
  item,
  UserId,
  setCurrentChatId,
  setChatReloadTrigger,
}) => {
  const [user1Username, setUser1Username] = useState("");
  const [user2Username, setUser2Username] = useState("");
  const [user1avatarUrl, setUser1AvatarUrl] = useState(null);
  const [user2avatarUrl, setUser2AvatarUrl] = useState(null);

  useEffect(() => {
    const getUserNames = async () => {
      const user1 = await fetchUserName(item.user1_id);
      const user2 = await fetchUserName(item.user2_id);
      setUser1Username(user1);
      setUser2Username(user2);
    };
    const getUserAvatars = async () => {
      const user1 = await fetchAvatar(item.user1_id);
      const user2 = await fetchAvatar(item.user2_id);
      setUser1AvatarUrl(user1);
      setUser2AvatarUrl(user2);
    };
    getUserNames();
    getUserAvatars();
  }, [item.user1_id, item.user2_id]);

  if (item.user1_id === UserId) {
    return (
      <ListItemButton
        onClick={() => {
          setCurrentChatId(item.chat_id);
          setChatReloadTrigger((prev) => !prev);
        }}
      >
        <ListItemIcon>
          {user2avatarUrl ? (
            <img
              src={user2avatarUrl}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          ) : (
            <DashboardIcon />
          )}
        </ListItemIcon>
        <ListItemText primary={user2Username} />
      </ListItemButton>
    );
  }

  return (
    <ListItemButton onClick={() => setCurrentChatId(item.chat_id)}>
      <ListItemIcon>
        {user1avatarUrl ? (
          <img
            src={user1avatarUrl}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : (
          <DashboardIcon />
        )}
      </ListItemIcon>
      <ListItemText primary={user1Username} />
    </ListItemButton>
  );
};

export function MainListItems({
  chatRoomData,
  UserId,
  setCurrentChatId,
  setChatReloadTrigger,
}) {
  return (
    <Box sx={{ overflow: "auto", height: 380 }}>
      {chatRoomData.map((item, index) => (
        <ChatListItem
          key={index}
          item={item}
          UserId={UserId}
          setCurrentChatId={setCurrentChatId}
          setChatReloadTrigger={setChatReloadTrigger}
        />
      ))}
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
