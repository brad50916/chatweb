import { Box, Button, Typography, Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Avatar = ({ onClose, user, setUser }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", user.id);

      try {
        const response = await fetch("http://localhost:5001/upload-avatar", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          onClose();
        } else {
          console.error("Error uploading file", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading file", error);
      }
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Modify Avatar
      </Typography>

      <form onSubmit={handleUpload}>
        <Input
          type="file"
          accept="image/*"
          onChange={handleChange}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2, mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </form>
    </Box>
  );
};

export default Avatar;
