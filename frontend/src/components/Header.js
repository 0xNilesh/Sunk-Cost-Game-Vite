import React from "react";
import {
    AppBar,
    IconButton,
    Typography,
    Toolbar,
    Button,
    useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Sidebar from "./Sidebar";

const Header = ({ toggleTheme }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4" sx={{ flexGrow: 1 }}>
                        Logo
                    </Typography>
                    <IconButton
                        sx={{ ml: 1 }}
                        onClick={toggleTheme}
                        color="inherit"
                    >
                        {theme.palette.mode === "dark" ? (
                            <Brightness7Icon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                    {isMobile ? (
                        <Sidebar />
                    ) : (
                        <div>
                            <Button to="/">
                                <Typography color={theme.palette.white}>
                                    Home
                                </Typography>
                            </Button>
                            <Button to="/pots" component={Link}>
                                <Typography color={theme.palette.white}>
                                    Pots
                                </Typography>
                            </Button>
                            <Button to="/profile" component={Link}>
                                <Typography color={theme.palette.white}>
                                    Profile
                                </Typography>
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;
