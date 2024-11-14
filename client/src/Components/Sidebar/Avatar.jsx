import React, { useEffect, useState } from "react";
import {
  Box, Avatar, Menu, MenuItem, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Button, Divider, ListItemIcon, Typography
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import axios from "axios";

import { Snackbar, Alert } from "@mui/material";

import "./Sidebar.css";

export default function AccountMenu() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false); // New state for confirmation dialog
  const [newPassword, setNewPassword] = useState("");
  const [updatedProfile, setUpdatedProfile] = useState({ name: "", email: "", profileImage: null });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Options: success, error, warning, info

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const open = Boolean(anchorEl);

  const openModal = () => {
    setUpdatedProfile({ name: user.name, email: user.email });
    setIsModalOpen(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      const { data } = await axios.put(`http://localhost:7000/api/student/student-user/${user._id}`, formData);
      const updatedUser = data.user;

      // Update localStorage with new profile data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsModalOpen(false);
      setConfirmationOpen(false); // Close the confirmation dialog

      // Refresh the page        // Show success Snackbar
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Error updating profile ");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.put(`http://localhost:7000/api/student/student-user/${user._id}/reset-password`, {
        newPassword
      });
      setResetPasswordModalOpen(false);
      setNewPassword("");
          // Show success Snackbar
      setSnackbarMessage("Password reset successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
          // Show error Snackbar
      setSnackbarMessage("Failed to reset password.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // Update the path based on your routing setup
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title='Account settings'>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 0 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup='true'
            aria-expanded={open ? "true" : undefined}
          >
            {user && user.profileImage ? (
              <Avatar
                src={`http://localhost:7000/public/uploads/${user.profileImage}`}
                sx={{ width: 79, height: 79 }}
              />
            ) : (
              <Avatar sx={{ width: 79, height: 79 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            ml: 5,
            bgcolor: "#1E1E1E",
            color: "white",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "& .MuiMenuItem-root": {
              color: "white",
            },
            "& .MuiListItemIcon-root": {
              color: "white",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={openModal}>
          <Avatar sx={{ bgcolor: "#444" }} /> Profile Settings
        </MenuItem>
        <Divider sx={{ bgcolor: "white" }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize='small' sx={{ color: "red" }} />
          </ListItemIcon>
          <span style={{ color: "red" }}>Logout</span>
        </MenuItem>
      </Menu>

      {/* Edit Profile Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent >
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
          <Button onClick={() => setConfirmationOpen(true)} color="primary">
            Save Changes
          </Button>
          <Button variant="outlined" onClick={() => setResetPasswordModalOpen(true)}>
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
        <DialogTitle>Confirm Save Changes</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save the changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} color="secondary">No</Button>
          <Button onClick={saveProfileChanges} color="primary">Yes</Button>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetPassword} color="primary">Reset Password</Button>
        </DialogActions>
      </Dialog>

          {/* Snackbar for notifications */}
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

    // 
  );
}
