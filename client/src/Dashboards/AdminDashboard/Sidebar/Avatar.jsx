import React, { useEffect, useState } from "react";
import {
  Box, Avatar, Menu, MenuItem, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Modal, TextField, Button, Typography, Divider, ListItemIcon
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import axios from "axios";

import { Snackbar, Alert } from "@mui/material";

export default function AccountMenu() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [updatedProfile, setUpdatedProfile] = useState({ name: "", email: "", profileImage: null });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Options: success, error, warning, info


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAdmin(parsedUser);
    }
  }, []);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/adminSignIn";
  };

  const openModal = () => {
    setUpdatedProfile({ name: admin.name, email: admin.email });
    setIsModalOpen(true);
  };

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setUpdatedProfile((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

const saveProfileChanges = async () => {
  const formData = new FormData();
  formData.append("name", updatedProfile.name);
  formData.append("email", updatedProfile.email);
  if (updatedProfile.profileImage) formData.append("profileImage", updatedProfile.profileImage);

  try {
    const { data } = await axios.put(
      `http://localhost:7000/api/admin/admin-user/${admin.id}`, 
      formData
    );
    const updatedAdmin = data.admin;

    // Update localStorage with the new profile data
    localStorage.setItem("user", JSON.stringify(updatedAdmin));
    setAdmin(updatedAdmin);
    setIsModalOpen(false);

    setSnackbarMessage("Profile updated successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  } catch (error) {
    setSnackbarMessage("Failed to update profile");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }
};


  const handleResetPassword = async () => {
    try {
      await axios.put(
        `http://localhost:7000/api/admin/admin-user/${admin.id}/reset-password`,
        { newPassword }
      );
      setResetPasswordModalOpen(false);
      setNewPassword("");
      
      setSnackbarMessage("Password reset successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to reset password, please contact the developer");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 0 }}>
            {admin && admin.profileImage ? (
              <Avatar src={`http://localhost:7000/public/uploads/${admin.profileImage}`} sx={{ width: 79, height: 79 }} />
            ) : (
              <Avatar sx={{ width: 79, height: 79 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1.5, ml: 4, bgcolor: "#1E1E1E", color: "white" } }}
      >
        <MenuItem onClick={openModal}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          Edit Profile
        </MenuItem>
        <Divider sx={{ bgcolor: "white" }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout fontSize="small" sx={{ color: "red" }} /></ListItemIcon>
          <span style={{ color: "red" }}>Logout</span>
        </MenuItem>
      </Menu>

      {/* Edit Profile Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={updatedProfile.name}
            onChange={handleProfileChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            name="email"
            value={updatedProfile.email}
            onChange={handleProfileChange}
            fullWidth
            margin="dense"
          />
          <input
            accept="image/*"
            type="file"
            onChange={handleProfileChange}
            style={{ marginTop: "1rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={saveProfileChanges} color="primary">Save Changes</Button>
          <Button variant="outlined" onClick={() => setResetPasswordModalOpen(true)}>
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={resetPasswordModalOpen} onClose={() => setResetPasswordModalOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="dense"
            // margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetPassword} color="primary">Reset Password</Button>
        </DialogActions>
      </Dialog>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>

    </React.Fragment>
  );
}
