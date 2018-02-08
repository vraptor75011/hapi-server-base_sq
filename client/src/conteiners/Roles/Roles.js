import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


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


        const { modal } = this.props;
        return (<div>

                <RolesTable{...this.props}/>
            </div>
        );
    }
}


Roles.propTypes = {
    classes: PropTypes.object.isRequired,
};



function mapDispatchToProps(dispatch){

    return bindActionCreators({getRoles, deleteRole, openModal, closeModal, editRole, newRole  }, dispatch);

}


function mapStateToProps(state) {

    return {roles: state.reducers.roles, role: state.reducers.role, modal: state.reducers.modal};
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Roles));