import React , {useState , useEffect} from 'react'
import Card from 'react-animated-3d-card';
import { Hashicon } from '@emeraldpay/hashicon-react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
const CardComp = (props) => {
  console.log(props)
  var end = new Date(0); // The 0 there is the key, which sets the date to the epoch
  end.setUTCSeconds(props.pot[10]);
  const { height, width } = useWindowDimensions();

  return(
    <Card  className="card"     
      style={{
        backgroundColor: 'inherit',
        width: width < 500 ? width-20 : "30vw",
        height: '200px',
        cursor: 'pointer',
        padding : "10px 30px"
      }}
    //   onClick={() => console.log('Card clicked')}
    >
      <div style={{textAlign : "center"}}>
      <Hashicon value={props.pot[9]} size={100}/>
      <Stack direction="row" mt={2} spacing={2} alignItems="center" justifyContent="center">
      {end <= new Date() ? 
      <Chip label="Expired" color="error" />
      :
      <React.Fragment>
        <Chip label="Active" color="success" />
        <Chip label={`Current Pice : ${props.pot[7]}`} color="primary" />
      </React.Fragment>
      }
      
      </Stack>

      </div>
        
    </Card>
)}
export default CardComp;