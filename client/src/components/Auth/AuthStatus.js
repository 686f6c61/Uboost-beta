import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAuth } from '../../contexts/AuthContext';

// Este componente será añadido al layout sin modificar el header original
const AuthStatus = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate('/login');
  };

  // Para usuarios que no han iniciado sesión
  if (!currentUser) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Button color="inherit" component={RouterLink} to="/login" size="small" sx={{ mr: 1 }}>
          Iniciar sesión
        </Button>
        <Button
          variant="contained"
          component={RouterLink}
          to="/register"
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Registrarse
        </Button>
      </Box>
    );
  }

  // Para usuarios que han iniciado sesión
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Tooltip title="Ajustes de cuenta">
        <Button
          color="inherit"
          onClick={handleMenu}
          size="small"
          sx={{ minWidth: 'auto', p: 0.5 }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: 'primary.dark',
              fontSize: '0.875rem'
            }}
          >
            {currentUser.firstName?.charAt(0) || 'U'}
          </Avatar>
          <ArrowDropDownIcon sx={{ ml: 0.5 }} />
        </Button>
      </Tooltip>
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
            '& .MuiAvatar-root': {
              width: 28,
              height: 28,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleClose();
          navigate('/profile');
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={() => {
            handleClose();
            navigate('/admin');
          }}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            Panel de (U)Boost
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AuthStatus;
