import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from 'material-ui';

import {withStyles} from 'material-ui/styles';
import axios from "axios/index";
import {push} from "react-router-redux";

import {connect} from "react-redux";
import {editUser, newUser} from "../../actions/users";
import {bindActionCreators} from "redux";



const styles = theme => ({
    root: {
        paddingRight: 2,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.A700,
                backgroundColor: theme.palette.secondary.A100,
            }
            : {
                color: theme.palette.secondary.A100,
                backgroundColor: theme.palette.secondary.A700,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    }
});


class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUserData: {},
            newUser: false
        }
    }

    componentWillMount() {
        const currentUserData = this.props.currentUserData;


        const newUser = !currentUserData.id;
        this.setState({currentUserData, newUser});
    }


    handleChangeUserForm = (event, type) => {
        console.log(this.state.currentUserData, event.target.value)


        let currentUserData = {...this.state.currentUserData, [type]: event.target.value};
        this.setState({currentUserData});


    };

    saveUser = () => {

        const {currentUserData, newUser} = this.state;

        if (!newUser) {

            const data = {
                id: currentUserData.id,
                firstName: currentUserData.firstName,
                lastName: currentUserData.lastName,
                email: currentUserData.email,
                password: currentUserData.password
            };

            this.props.editUser(data);
        }
        else {
            let config = {
                responseType: 'json'
            };

            const data = [{
                firstName: currentUserData.firstName,
                lastName: currentUserData.lastName,
                email: currentUserData.email,
                password: currentUserData.password
            }];
            console.log(`http://localhost:8000/user/`, data, config)
            axios.post('http://localhost:8000/user', data, config)
                .then(response => {
                    console.log('response', response);
                    this.props.getUsers();
                    this.props.cancelEdit();
                }).catch((error) => {


                if (error.response && error.response.status === 401) {
                    //if request is unauthorized redirect to login page
                    this.props.dispatch(push("/login"));
                }
            });
        }


    };


    render() {
        const {classes, modal, cancelEdit} = this.props;
        const {currentUserData, newUser} = this.state;


        return (<Dialog
            open={modal}
            onClose={this.cancelEdit}
            classes={{paper: classes.dialog}}
        >
            <DialogTitle>{newUser ? 'New User' : 'Edit User'}</DialogTitle>
            <DialogContent>
                <form noValidate autoComplete="off">
                    <TextField
                        id="firstName"
                        label="First Name"
                        className={classes.textField}
                        value={currentUserData.firstName}
                        onChange={(event) => this.handleChangeUserForm(event, 'firstName')}
                        margin="normal"
                        fullWidth={true}
                    />
                    <TextField
                        id="lastName"
                        label="Last Name"
                        className={classes.textField}
                        value={currentUserData.lastName}
                        onChange={(event) => this.handleChangeUserForm(event, 'lastName')}
                        margin="normal"
                        fullWidth={true}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        className={classes.textField}
                        value={currentUserData.email}
                        onChange={(event) => this.handleChangeUserForm(event, 'email')}
                        margin="normal"
                        fullWidth={true}
                    />
                    {newUser && <TextField
                        id="password"
                        label="Password"
                        className={classes.textField}
                        value={currentUserData.password}
                        onChange={(event) => this.handleChangeUserForm(event, 'password')}
                        margin="normal"
                        fullWidth={true}
                    />}

                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelEdit} color="primary">Cancel</Button>
                <Button onClick={this.saveUser} color="primary">Save</Button>
            </DialogActions>
        </Dialog>)
    }
}


function mapDispatchToProps(dispatch){

    return bindActionCreators({editUser, newUser }, dispatch);

}


function mapStateToProps(state) {

    return {editUser: state.reducers.editUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserForm));