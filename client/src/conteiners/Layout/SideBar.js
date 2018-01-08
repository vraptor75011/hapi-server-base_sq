import React, {Component} from 'react';

import {withStyles} from 'material-ui/styles';
import * as actions from '../../actions/index';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';


import Drawer from 'material-ui/Drawer';

import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';

import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import InboxIcon from 'material-ui-icons/Inbox';
import DashboardIcon from 'material-ui-icons/Dashboard';
import PeopleIcon from 'material-ui-icons/People';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        width: '100%',
        height: 430,
        marginTop: theme.spacing.unit * 3,
        zIndex: 1,
        overflow: 'hidden'
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%'
    },
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    'appBarShift-left': {
        marginLeft: drawerWidth
    },
    'appBarShift-right': {
        marginRight: drawerWidth
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20
    },
    hide: {
        display: 'none'
    },
    drawerPaper: {
        position: 'fixed',
        height: '100%',
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    },
    content: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            content: {
                height: 'calc(100% - 64px)',
                marginTop: 64
            }
        }
    },
    'content-left': {
        marginLeft: -drawerWidth
    },
    'content-right': {
        marginRight: -drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    'contentShift-left': {
        marginLeft: 0
    },
    'contentShift-right': {
        marginRight: 0
    }
});

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchor: 'left'
        };
    }

    handleChangeAnchor = event => {
        this.setState({
            anchor: event.target.value
        });
    };

    handleClickLink = (type) =>{

        this.props.history.push("/"+type);
    };

    render() {
        const {classes, theme, open} = this.props;
        const {anchor} = this.state;

        console.log(this.props);
        return (
            <Drawer
                type="persistent"
                classes={{
                    paper: classes.drawerPaper
                }}
                anchor={anchor}
                open={open}
            >
                <div className={classes.drawerInner}>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.props.handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <ListItem button onClick={()=>this.handleClickLink('')}>
                        <ListItemIcon >
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItem>
                    <ListItem button onClick={()=>this.handleClickLink('users')}>
                        <ListItemIcon>
                            <PeopleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Users"/>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Roles"/>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItem>
                    <Divider/>
                    <List className={classes.list}/>
                </div>
            </Drawer>
        );
    }
}

export default withRouter(connect(null, actions)(withStyles(styles)(SideBar)));
