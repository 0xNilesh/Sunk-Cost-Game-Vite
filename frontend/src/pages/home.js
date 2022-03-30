import { Box, Grid, Button, Typography } from "@mui/material";
import React from "react";
import PiggyBank from "../Assets/piggybank.png";
import { useTheme, styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const CBox = styled(Box)`
    background: url(${PiggyBank}) 100% 50% / cover;
    z-index: 10;
    margin-top: 5px;
    max-width: 80%;
    min-height: 90vh;

    @media (max-width: 1200px) {
        min-height: 80vh;
    }
    @media (max-width: 900px) {
        min-height: 60vh;
    }
    @media (max-width: 600px) {
        min-height: 50vh;
    }
`;

const PButton = styled(Button)`
    background: linear-gradient(45deg, #6d86d7 30%, #8b3ed6 90%);
    border-radius: 50px;
    border: 0;
    margin: 1rem 2rem;
    margin-left: 0;
    font-size: 1.5rem;
    color: white;
    max-width: 12rem;
    max-height: 10rem;
    min-height: 3rem;
    min-width: 12rem;
    box-shadow: 0 3px 5px 2px rgba(109, 134, 215, 0.3);
    @media (max-width: 960px) {
        font-size: 1rem;
    }
    @media (max-width: 355px) {
        font-size: 1rem;
    }
`;

const CTypography = styled(Typography)`
    font-size: 2rem;
    @media (max-width: 1200px) {
        font-size: 1.8rem;
    }
    @media (max-width: 900px) {
        font-size: 1.7rem;
    }
    @media (max-width: 600px) {
        font-size: 2rem;
    }
`;

const Home = () => {
    const theme = useTheme();

    return (
        <Box>
            <Grid container direction="row" alignItems="center">
                <Grid item xs={12} md={7} sm={12}>
                    <CBox></CBox>
                </Grid>
                <Grid item xs={12} md={4} sm={12}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        height="100%"
                        m={3}
                    >
                        <Box>
                            <Typography variant="h2">
                                <strong>
                                    <span
                                        style={{
                                            color: `${theme.palette.heading}`,
                                        }}
                                    >
                                        Smart Fomo Pot
                                    </span>{" "}
                                </strong>
                            </Typography>
                        </Box>
                        <Box pt={2}>
                            <CTypography variant="h4">
                                <span
                                    style={{
                                        color: `${theme.palette.heading}`,
                                    }}
                                >
                                    Smart Fomo Pot is a fun DAPP similar to
                                    Fomo3D for rewarding lucky Vite users.
                                    <br />
                                </span>{" "}
                                <span
                                    style={{
                                        color: `${theme.palette.heading}`,
                                    }}
                                >
                                    <br />
                                    Buy when no one is buying and grab the whole
                                    bag 👽.
                                </span>
                            </CTypography>
                        </Box>
                        <Box>
                            <PButton to="/pots" component={Link}>
                                Buy Pots
                            </PButton>
                            <PButton to="/createpot" component={Link}>
                                Create Pot
                            </PButton>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="center"
                        ></Box>
                        <Box p={1} m={1}></Box>
                        <Box p={1} m={1}></Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
