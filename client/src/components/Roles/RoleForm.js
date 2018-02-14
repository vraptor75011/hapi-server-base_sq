import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from 'material-ui';
import form from "../../reducers/roles/role_reducer";


class RoleForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentData: {},
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

        const {currentData} = this.state;
        const data = {
            id: currentData.id,
            name: currentData.name,
            description: currentData.description,

        };

                switch (this.props.row.type) {

                    case 'edit':
                        this.props.editRole(data);
                        break;
                    case 'new':
                        delete data.id;
                        this.props.newRole(data);
                        break;
                    case 'delete':
                        this.props.deleteRole(data.id);
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
            <DialogTitle>{row.type === 'delete'? 'Delete Role' : row.type === 'edit' ? 'Edit Role': 'New Role' }</DialogTitle>
            <DialogContent>
                {row.type !== 'delete' && <form noValidate autoComplete="off">
                    <TextField
                        id="name"
                        label="Name"
                        value={currentData.name}
                        onChange={(event) => this.handleChangeForm(event, 'name')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(form.error && form.error.name)}
                        helperText={form.error && form.error.name}
                    />
                    <TextField
                        id="description"
                        label="Description"
                        value={currentData.description}
                        onChange={(event) => this.handleChangeForm(event, 'description')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(form.error && form.error.description)}
                        helperText={form.error && form.error.description}

                    />

                </form>}
                {row.type === 'delete' && <div>Are you sure to delete this role?</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} color="primary">Cancel</Button>
                {row.type !== 'delete' && <Button onClick={this.saveUser} color="primary">Save</Button>}
                {row.type === 'delete' && <Button onClick={this.saveUser} color="primary">Delete</Button>}
            </DialogActions>
        </Dialog>)
    }
}




export default RoleForm;