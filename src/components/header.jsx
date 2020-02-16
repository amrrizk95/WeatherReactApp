

import   React from 'react'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
class header extends React.Component{

    render(){
        
       
        return(
                    <AppBar  style={{ background: '#2E3B55' }}>
                    <Toolbar>
                        <Typography variant="h5">Weather App</Typography>
                    </Toolbar>
                    </AppBar>              
        )
    }
}

export default   header;