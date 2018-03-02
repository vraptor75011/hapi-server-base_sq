import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import RolesTable from '../../components/Roles/RolesTable';
import {withStyles} from 'material-ui/styles';
import {getRealms, deleteRealm, editRealm, newRealm} from '../../actions/realms';
import {cancelForm} from '../../actions/form';
import { openModal, closeModal } from '../../actions/modals';
import { translate } from 'react-i18next';


const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    }
});




class Realms extends React.PureComponent {
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


Realms.propTypes = {
    classes: PropTypes.object.isRequired,
};



function mapDispatchToProps(dispatch){

    return bindActionCreators({getRealms, deleteRealm, openModal, closeModal, editRealm, newRealm, cancelForm  }, dispatch);

}


function mapStateToProps(state) {

    return {realms: state.reducers.realms, realm: state.reducers.realm, modal: state.reducers.modal, form: state.reducers.form };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(translate()(Roles)));
