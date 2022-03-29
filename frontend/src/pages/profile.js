import { Container } from "@mui/material";
import React from "react";
import SignIn from "../components/signin";
const Profile = () => {
    return(
        <Container maxWidth="lg" sx={{textAlign : "center"}}>
            <SignIn />

        </Container>
    )
}
export default Profile;
