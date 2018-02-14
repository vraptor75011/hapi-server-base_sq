import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from 'material-ui';
import form from "../../reducers/roles/role_reducer";






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

        const {modal, cancel, row, form} = this.props;
        const {currentData} = this.state;


        return (<Dialog
            open={modal}
            onClose={cancel}
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
                        error = {Boolean(form.error && form.error.firstName)}
                        helperText={form.error && form.error.firstName}
                    />
                    <TextField
                        id="lastName"
                        label="Last Name"
                        value={currentData.lastName}
                        onChange={(event) => this.handleChangeForm(event, 'lastName')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(form.error && form.error.lastName)}
                        helperText={form.error && form.error.lastName}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        value={currentData.email}
                        onChange={(event) => this.handleChangeForm(event, 'email')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(form.error && form.error.email)}
                        helperText={form.error && form.error.email}
                    />
                    {!row.id  && <TextField
                        id="password"
                        label="Password"
                        value={currentData.password}
                        onChange={(event) => this.handleChangeForm(event, 'password')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(form.error && form.error.password)}
                        helperText={form.error && form.error.password}
                    />}

                </form>}
                {row.type === 'delete' && <div>Are you sure to delete this user?</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} color="primary">Cancel</Button>
                {row.type !== 'delete' && <Button onClick={this.saveUser} color="primary">Save</Button>}
                {row.type === 'delete' && <Button onClick={this.saveUser} color="primary">Delete</Button>}
            </DialogActions>
        </Dialog>)
    }
}




export default UserForm;