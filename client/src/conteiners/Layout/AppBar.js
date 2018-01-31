import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import {withStyles} from 'material-ui/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import UserButton from './UserButton'
import SideBar from './SideBar.js';


const styles = {

    flex: {
        flex: 1,
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        boxShadow: 'none'
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    button: {
        color: '#fff',
    },
    buttonExit: {
        float: 'right',
        margin: '1em'
    },
    accountCircle: {
        height: '1.5em',
        width: '1.5em'
    },
    account: {
        display: 'flex',
        padding: '1em'
    },
    avatar: {
        marginRight: '1em'
    },
    row: {
        display: 'flex'
    }
};

class TopBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };

    }

    handleDrawerOpen = () => {
        console.log('sfdsfds')
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    handleChangeAnchor = event => {
        this.setState({
            anchor: event.target.value,
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.appFrame}>
                <AppBar position="static" color="primary" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classes.menuButton} color="inherit">
                            <MenuIcon/>
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Title
                        </Typography>
                        <UserButton/>
                    </Toolbar>

                </AppBar>
                <SideBar {...this.state} handleDrawerClose={this.handleDrawerClose}/>

            </div>
        );
    }
}


export default connect(null, null)(withStyles(styles)(TopBar));


