import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from 'material-ui';






class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUserData: {},
            newUser: false
        }
    }

    componentWillMount() {
        const currentData = this.props.row;
        this.setState({currentData});
    }


    handleChangeForm = (event, type) => {

        let currentData = {...this.state.currentData, [type]: event.target.value};
        this.setState({currentData});


    };

    saveUser = () => {
console.log('ciaoo')
        const {currentData} = this.state;
        const data = {
            id: currentData.id,
            firstName: currentData.firstName,
            lastName: currentData.lastName,
            email: currentData.email,
            password: currentData.password
        };

        console.log(data, this.props.row.type)
                switch (this.props.row.type) {

                    case 'edit':
                        this.props.editUser(data);
                        break;
                    case 'new':
                        delete data.id;
                        this.props.newUser(data);
                        break;
                    case 'delete':
                        this.props.deleteUser(data.id);
                        break;


                }


    };



    render() {

        const {modal, cancelEdit, row, user} = this.props;
        const {currentData} = this.state;


        return (<Dialog
            open={modal}
            onClose={this.cancelEdit}
        >
            <DialogTitle>{row.type === 'delete'? 'Delete User' : row.type === 'edit' ? 'Edit User': 'New User' }</DialogTitle>
            <DialogContent>
                {row.type !== 'delete' && <form noValidate autoComplete="off">
                    <TextField
                        id="firstName"
                        label="First Name"
                        value={currentData.firstName}
                        onChange={(event) => this.handleChangeForm(event, 'firstName')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(user.error && user.error.firstName)}
                        helperText={user.error && user.error.firstName}
                    />
                    <TextField
                        id="lastName"
                        label="Last Name"
                        value={currentData.lastName}
                        onChange={(event) => this.handleChangeForm(event, 'lastName')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(user.error && user.error.lastName)}
                        helperText={user.error && user.error.lastName}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        value={currentData.email}
                        onChange={(event) => this.handleChangeForm(event, 'email')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(user.error && user.error.email)}
                        helperText={user.error && user.error.email}
                    />
                    {!row.id  && <TextField
                        id="password"
                        label="Password"
                        value={currentData.password}
                        onChange={(event) => this.handleChangeForm(event, 'password')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(user.error && user.error.password)}
                        helperText={user.error && user.error.password}
                    />}

                </form>}
                {row.type === 'delete' && <div>Are you sure to delete this user?</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelEdit} color="primary">Cancel</Button>
                {row.type !== 'delete' && <Button onClick={this.saveUser} color="primary">Save</Button>}
                {row.type === 'delete' && <Button onClick={this.saveUser} color="primary">Delete</Button>}
            </DialogActions>
        </Dialog>)
    }
}




export default UserForm;