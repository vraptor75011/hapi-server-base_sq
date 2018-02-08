import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import RoleForm from '../../components/Roles/RoleForm';
import RolesTable from '../../components/Roles/RolesTable';


import IconButton from 'material-ui/IconButton';

import {Button} from 'material-ui';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';


import {getRoles, deleteRole, editRole, newRole, modalRoleData} from '../../actions/roles';
import { openModal, closeModal } from '../../actions/modals';



const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
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

                <RolesTable{...this.props}/>
                {modal  && <RoleForm {...this.state} modal={this.props.modal} edit={this.props.editRole}
                                     newData={this.props.newData} new={this.props.newRole} modalData={this.props.modalData}
                                     cancelEdit={this.cancelEdit} get={this.getRoles} delete={this.props.deleteRole} />}
            </div>
        );
    }
}


Roles.propTypes = {
    classes: PropTypes.object.isRequired,
};



function mapDispatchToProps(dispatch){

    return bindActionCreators({getRoles, deleteRole, openModal, closeModal, editRole, newRole, modalRoleData  }, dispatch);

}


function mapStateToProps(state) {
console.log(state)
    return {roles: state.reducers.roles, delete: state.reducers.deleteRole,modal: state.reducers.modal,
        modalData: state.reducers.modalRoleData, edit: state.reducers.editRole, newData: state.reducers.newRole};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Roles));