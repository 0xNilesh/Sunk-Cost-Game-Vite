import React from "react";
import CardComp from "../components/Card";
import {
	Box,
	Grid,
	Container
} from "@mui/material";
import { useSelector, useDispatch } from 'react-redux'
const Pots = () => {
    const pots = useSelector((state) => state.pots.pots);

    return (
				<Container maxWidth="xl" sx={{paddingTop : "80px"}}>
					 <Grid
						container
						justifyContent="center"
						alignItems="center"
					>
								<Grid
									container
									direction="row"
									justifyContent="space-around"
									alignItems="center"
                                    spacing = {5}
								>
                                    {pots.map(each=>{
                                        return(
                                    <Grid item lg={4} key={each}>
										<CardComp pot={each}/>
									</Grid>
                                        )
                                    })}
									
								</Grid>
			 		</Grid>
			  </Container>
    )
};
export default Pots;
