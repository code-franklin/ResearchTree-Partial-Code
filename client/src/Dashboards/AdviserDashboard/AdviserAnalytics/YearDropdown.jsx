import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    backgroundColor: '#1E1E1E', // Set background color to #1E1E1E
    color: 'white', // Set text color to white
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      display: 'flex',
      justifyContent: 'center', // Center text horizontally
      '& .MuiSvgIcon-root': {
        display: 'none', // Hide icons to keep text centered
        fontSize: 21,
        color: 'white', // Set icon color to white
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: '-870px',
  marginTop: '40px',
  position: 'absolute',
  fontSize: '21px',
  backgroundColor: '#1E1E1E', // Set button background color to #1E1E1E
  color: 'white', // Set button text color to white
  '&:hover': {
    backgroundColor: alpha('#1E1E1E', 0.8), // Darken the background on hover
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState('2024'); // State to track the selected year
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (year) => {
    setAnchorEl(null);
    if (year) {
      setSelectedYear(year); // Update the button text with the selected year
    }
  };

  return (
    <div>
      <StyledButton
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedYear} {/* Display the selected year */}
      </StyledButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(null)}
      >
        <MenuItem onClick={() => handleClose('2024')} disableRipple>
          2024
        </MenuItem>
        <MenuItem onClick={() => handleClose('2023')} disableRipple>
          2023
        </MenuItem>
        <MenuItem onClick={() => handleClose('2022')} disableRipple>
          2022
        </MenuItem>
        <MenuItem onClick={() => handleClose('2021')} disableRipple>
          2021
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
