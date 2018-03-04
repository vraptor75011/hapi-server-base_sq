import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import GeoRepartitionsTable from '../../components/GeoRepartitions/GeoRepartitionsTable';
import {withStyles} from 'material-ui/styles';
import {getGeoRepartitions, deleteGeoRepartition, editGeoRepartition, newGeoRepartition} from '../../actions/geoRepartitions';
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


class GeoRepartitions extends React.PureComponent {
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
        return (
            <div>
                <GeoRepartitionsTable{...this.props}/>
            </div>
        );
    }
}


GeoRepartitions.propTypes = {
    classes: PropTypes.object.isRequired,
};



function mapDispatchToProps(dispatch){

    return bindActionCreators({getGeoRepartitions, deleteGeoRepartition, openModal, closeModal, editGeoRepartition, newGeoRepartition, cancelForm  }, dispatch);

}


function mapStateToProps(state) {

    return {geoRepartitions: state.reducers.geoRepartitions, geoRepartition: state.reducers.geoRepartition, modal: state.reducers.modal, form: state.reducers.form };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(translate()(GeoRepartitions)));
