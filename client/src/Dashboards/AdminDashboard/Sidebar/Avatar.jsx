import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import './Sidebar.css';

export default function AccountMenu() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Update the path based on your routing setup
  };


  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 5 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {user && user.profileImage ? (
              <Avatar src={`http://localhost:5000/public/uploads/${user.profileImage}`} sx={{ width: 79, height: 79 }} />
            ) : (
              <Avatar sx={{ width: 79, height: 79 }} /> // Fallback Avatar if no user or no profile image
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            ml: 4,
            bgcolor: "#1E1E1E",
            color: "white", // Set text color to white
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '& .MuiMenuItem-root': {
              color: 'white', // Ensure all MenuItem text is white
            },
            '& .MuiListItemIcon-root': {
              color: 'white', // Ensure all icons are white
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem >
          <Avatar sx={{ bgcolor: '#444' }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar sx={{ bgcolor: '#444' }} /> My account
        </MenuItem>
        <Divider sx={{ bgcolor: 'white' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon onClick={handleLogout}>
            <Logout onClick={handleLogout} fontSize="small" sx={{ color: 'red' }} /> {/* Set icon color to red */}
          </ListItemIcon>
          <span onClick={handleLogout} style={{ color: 'red' }}>Logout</span> {/* Set text color to red */}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}