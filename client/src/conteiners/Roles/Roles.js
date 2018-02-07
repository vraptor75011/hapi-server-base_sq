import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import UserForm from '../../components/Roles/RoleForm';
import UsersTable from '../../components/Roles/RolesTable';


import IconButton from 'material-ui/IconButton';

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from 'material-ui';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';


import {getRoles, deleteUser, editUser, newUser} from '../../actions/roles';
import { openModal, closeModal } from '../../actions/modals';



const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    }
});

const AddButton = ({onExecute}) => (

    <Button
        color="primary"
        onClick={onExecute}
        title="Create new row"
    >
        New
    </Button>

);
AddButton.propTypes = {
    onExecute: PropTypes.func.isRequired,
};

const EditButton = ({onExecute}) => (
    <IconButton onClick={onExecute} title="Edit row">
        <EditIcon/>
    </IconButton>
);
EditButton.propTypes = {
    onExecute: PropTypes.func.isRequired,
};

const DeleteButton = ({onExecute}) => (
    <IconButton onClick={onExecute} title="Delete row">
        <DeleteIcon/>
    </IconButton>
);
DeleteButton.propTypes = {
    onExecute: PropTypes.func.isRequired,
};


class Roles extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        }



    }


    cancelEdit = () => {
        this.props.closeModal();

    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });

        if (event.target.value.length> 2){
            const data = {'$fullTextSearch':event.target.value };
            this.props.getUsers(data);
        }

    };

    render() {


        const { modal, classes } = this.props;

        console.log( classes)
        return (<div>

                <UsersTable {...this.props}/>
                {modal  && <UserForm {...this.state} modal={this.props.modal} editUser={this.props.editUser}
                                     newUser={this.props.newUser} userData={this.props.userData}
                                     cancelEdit={this.cancelEdit} getUsers={this.getUsers} deleteUser={this.props.deleteUser} />}
            </div>
        );
    }
}


Roles.propTypes = {
    classes: PropTypes.object.isRequired,
};



function mapDispatchToProps(dispatch){

    return bindActionCreators({getRoles, deleteUser, openModal, closeModal, editUser, newUser  }, dispatch);

}


function mapStateToProps(state) {

    return {roles: state.reducers.roles, deleteSingleUser: state.reducers.deleteUser,
        modal: state.reducers.modal, editUser: state.reducers.editUser, userData: state.reducers.singleUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Roles));