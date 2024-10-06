"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/userContext";
import UserCard from "./CardUser";


interface Childen {
  children: React.ReactNode;
}
function ResponsiveAppBar({ children }: Childen) {
  const router = useRouter();
  const { user, logOut } = useSession();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    router.push("/myMovies");
  };
  const handleCloseNavMenuHome = () => {
    setAnchorElNav(null);
    router.push("/dashboard");
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div>
      <AppBar position="fixed">
        <Container maxWidth="xl" className=" min-w-full ">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="configuração">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, display: user?.adm ? "" : "none" }}
                >
                  <DensityMediumIcon
                    sx={{
                      color: "white",
                      fontSize: 30,
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    router.push(`/dashboard`);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>Home</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    router.push(`/register?id=${user?.id}`);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Novo Usuário
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    router.push(`/movie?id=${user?.id}`);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Novo Filme
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    router.push(`/users`);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Editar Usuários
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    router.push(`/movies`);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Editar Filmes
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex", marginLeft: 10 },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Locadora
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MovieCreationIcon sx={{ color: "white", fontSize: 40 }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    Meu Filmes
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenuHome}>
                  <Typography sx={{ textAlign: "center" }}>Home</Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Locadora
            </Typography>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography sx={{ textAlign: "center" }}>Meu Filmes</Typography>
              </MenuItem>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              <MenuItem onClick={handleCloseNavMenuHome}>
                <Typography sx={{ textAlign: "center" }}>Home</Typography>
              </MenuItem>
            </Box>
            <div className="flex flex-row absolute right-3">
              <Box
                sx={{
                  display: {
                    xs: "none",
                    md: "flex",
                    marginRight: 20,
                  },
                }}
              >
                <div>
                  <UserCard />
                </div>
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Sair">
                  <IconButton sx={{ p: 0 }} onClick={logOut}>
                    <LogoutIcon sx={{ color: "white", fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      {children}
    </div>
  );
}
export default ResponsiveAppBar;
