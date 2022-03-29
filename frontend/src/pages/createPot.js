import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SignIn from '../components/signin';
import { useSelector} from 'react-redux'

const CreatePot = ()=> {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const user = useSelector((state) => state.user);

  return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <ShoppingBagIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            CREATE YOUR OWN POT
          </Typography>
          <SignIn/>
          {user.address ?
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="initialTimer"
              label="Initial Timer (Enter in sec)"
              name="initialTimer"
              autoFocus
              placeholder='Initial Timer for which a Pot remains valid'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="maxTimer"
              label="Max Timer Limit (Enter in sec)"
              name="maxTimer"
              autoFocus
              placeholder='Max Time limit upto which end time be extended when players buy in'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="buyInIncrementAmount"
              label="Buy In Increment Amount"
              name="buyInIncrementAmount"
              autoFocus
              placeholder='Amount by which Pot Price is increased at each buy in'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="burnAmount"
              label="Burn Amount"
              name="burnAmount"
              autoFocus
              placeholder='Enter Amount to be burned at each buy in'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="timeExtension"
              label="Time Extension (in sec)"
              name="timeExtension"
              autoFocus
              placeholder='Time by which end time is increased at each buy in'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="tokenid"
              label="Token ID"
              name="tokenid"
              autoFocus
              placeholder='Token ID of token in which the pot should be purchased by each player'
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Pot
            </Button>
          </Box>
          :null}
        </Box>
      </Container>
  );
}

export default CreatePot;