import React, {Component} from 'react';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Popover from 'material-ui/Popover';
import Divider from 'material-ui/Divider';
import {findDOMNode} from 'react-dom';
import {withStyles} from 'material-ui/styles';
import * as actions from '../../actions/index';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';


const styles = {

    flex: {
        flex: 1,
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
        marginRight: '1em',
        backgroundColor: '#FF5722',
        color: '#fff'
    },
    row: {
        display: 'flex'
    }
};

class UserButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
            firstName: '',
            lastName: '',
            email: ''
        };

    }

    componentWillMount() {
        const profile = JSON.parse(localStorage.getItem('profile'));
        console.log(profile)

        if (profile) {
            const {firstName, lastName, email} = profile;
            this.setState({firstName, lastName, email});
        }


    }

    handleClickButton = () => {
        this.setState({
            open: true,
            anchorEl: findDOMNode(this.accauntButton)
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    handleQuit = () => {
        this.props.signoutUser();
    };

    render() {
        const {classes} = this.props;
        const {firstName, lastName, email} = this.state;
        return (<div>
                <IconButton ref={node => this.accauntButton = node}
                            onClick={this.handleClickButton}
                            color="primary" className={classes.button} component="span">
                    <AccountCircle className={classes.accountCircle}/>
                </IconButton>
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorPosition={{top: 200, left: 400}}
                    onClose={this.handleRequestClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div className={classes.account}>
                        <Avatar className={classes.avatar}>{firstName.charAt(0)}{lastName.charAt(0)}</Avatar>
                        <div>
                            <Typography className={classes.typography}>{firstName + ' ' + lastName}</Typography>
                            <Typography className={classes.typography}>{email}</Typography>
                        </div>
                    </div>
                    <Divider/>
                    <Button raised color="primary" onClick={this.handleQuit} className={classes.buttonExit}>
                        Esci
                    </Button>
                </Popover>
            </div>
        );
    }
}


export default withRouter(connect(null, actions)(withStyles(styles)(UserButton)));


