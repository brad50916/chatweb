import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from '@mui/icons-material/Logout';
import Person2Icon from '@mui/icons-material/Person2';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import webpImage from "/default.webp";
import { getUserName, getAvatar } from "./Api.jsx";

const fetchAvatar = async (userId) => {
  try {
    const result = await getAvatar(userId);

    if (result) {
      return result;
    } else {
      return webpImage;
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
      const user1 = await getUserName(item.user1_id);
      const user2 = await getUserName(item.user2_id);
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
          {user2avatarUrl && (
            <img
              src={user2avatarUrl}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          )}
        </ListItemIcon>
        <ListItemText primary={user2Username} />
      </ListItemButton>
    );
  }

  return (
    <ListItemButton onClick={() => setCurrentChatId(item.chat_id)}>
      <ListItemIcon>
        {user1avatarUrl && (
          <img
            src={user1avatarUrl}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
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
    <Box sx={{ overflow: "auto", height: '71.5vh' }}>
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
          <Person2Icon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Setting" />
      </ListItemButton>
      <ListItemButton onClick={onClickHandler}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
}
