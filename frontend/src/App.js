import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Pots from "./pages/pots";
import EachPot from "./pages/eachPot";
import Header from "./components/Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { light, dark } from "./config/themization";
import QRCode from "qrcode.react";
import { TryConnect, Login, Logout } from "./redux/action";
import { useSelector, useDispatch } from "react-redux";

const useDarkMode = () => {
    const [theme, setTheme] = useState(dark);

    const toggleTheme = () => {
        const updatedTheme = theme === dark ? light : dark;
        setTheme(updatedTheme);
    };
    return [theme, toggleTheme];
};

const App = () => {
    const dispatch = useDispatch();
    useEffect(async () => {
        TryConnect();
        await dispatch(Login());
    }, []);

    const user = useSelector((state) => state.user);
    const [theme, toggleTheme] = useDarkMode();
    const themeConfig = createTheme(theme);

    useEffect(async () => {}, []);

    return (
        <ThemeProvider theme={themeConfig}>
            <Header toggleTheme={toggleTheme} />
            <h1 style={{ padding: "10px" }}>
                {" "}
                {user.uri && <QRCode value={user.uri} />}
            </h1>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/pots" element={<Pots />} />
                <Route path="/pots/:num" element={<EachPot />} />
                <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
        </ThemeProvider>
    );
};

export default App;
