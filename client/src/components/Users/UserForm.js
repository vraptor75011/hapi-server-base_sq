import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from 'material-ui';
import {withStyles} from 'material-ui/styles';






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
        const currentUserData = this.props.userData.user;

        this.setState({currentUserData});
    }


    handleChangeUserForm = (event, type) => {

        let currentUserData = {...this.state.currentUserData, [type]: event.target.value};
        this.setState({currentUserData});


    };

    saveUser = () => {

        const {currentUserData} = this.state;
        const data = {
            id: currentUserData.id,
            firstName: currentUserData.firstName,
            lastName: currentUserData.lastName,
            email: currentUserData.email,
            password: currentUserData.password
        };

                switch (this.props.userData.type) {

                    case 'edit':
                        this.props.editUser(data);
                        break;
                    case 'new':
                        delete data.id;
                        this.props.newUser(data);
                        break;
                    case 'delete':
                        console.log('delete***')
                        this.props.deleteUser(data.id);
                        break;


                }




    };


    render() {
        const {classes, modal, cancelEdit, userData} = this.props;
        const {currentUserData} = this.state;


        return (<Dialog
            open={modal}
            onClose={this.cancelEdit}
            classes={{paper: classes.dialog}}
        >
            <DialogTitle>{userData.type === 'delete'? 'Delete User' : userData.type === 'edit' ? 'Edit User': 'New User' }</DialogTitle>
            <DialogContent>
                {userData.type !== 'delete' && <form noValidate autoComplete="off">
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
                    {!currentUserData.id  && <TextField
                        id="password"
                        label="Password"
                        className={classes.textField}
                        value={currentUserData.password}
                        onChange={(event) => this.handleChangeUserForm(event, 'password')}
                        margin="normal"
                        fullWidth={true}
                    />}

                </form>}
                {userData.type === 'delete' && <div>Are you sure to delete this user?</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelEdit} color="primary">Cancel</Button>
                {userData.type !== 'delete' && <Button onClick={this.saveUser} color="primary">Save</Button>}
                {userData.type === 'delete' && <Button onClick={this.saveUser} color="primary">Delete</Button>}
            </DialogActions>
        </Dialog>)
    }
}




export default withStyles(styles)(UserForm);