// export const API_URL = "http://localhost:5001";
export const API_URL = "https://chatweb-0dwa.onrender.com";

export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/verify`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.userId;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const login = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const signup = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getAllChatRoomData = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/getAllChatRoomData?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getUserName = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/getUserName?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const uploadAvatar = async (file, userId) => {
  const formData = new FormData();
  formData.append("avatar", file);
  formData.append("userId", userId);

  try {
    const response = await fetch(`${API_URL}/upload-avatar`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getAvatar = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/avatar`);
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return url;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await fetch(`${API_URL}/getMessage?chatId=${chatId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getToUserId = async (chatId, userId) => {
  try {
    const response = await fetch(
      `${API_URL}/getToUserId?chatId=${chatId}&userId=${userId}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const modifyUserInfo = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/modifyUserInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const searchUser = async (username) => {
  try {
    const response = await fetch(`${API_URL}/search?username=${username}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getChatRoomId = async (userId, friendId) => {
  try {
    const response = await fetch(`${API_URL}/getChatRoomId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        friend_id: friendId,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
};
