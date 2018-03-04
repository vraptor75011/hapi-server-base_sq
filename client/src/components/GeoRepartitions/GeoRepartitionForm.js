import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,} from 'material-ui';
import form from "../../reducers/geoRepartitions/geoRepartition_reducer";


class GeoRepartitionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentData: {}
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

    saveGeoRepartition = () => {
        const {currentData} = this.state;
        const data = {
            id: currentData.id,
            name: currentData.name,
        };
                switch (this.props.row.type) {

                    case 'edit':
                        this.props.editGeoRepartition(data);
                        break;
                    case 'new':
                        delete data.id;
                        this.props.newGeoRepartition(data);
                        break;
                    case 'delete':
                        this.props.deleteGeoRepartition(data.id);
                        break;
                }
    };


    render() {
        const {modal, cancel, row, form, t} = this.props;
        const {currentData} = this.state;



        return (<Dialog
            open={modal}
            onClose={cancel}
        >
            <DialogTitle>{row.type === 'delete'? t('app:geoRepartition.deleteGeoRepartition') : row.type === 'edit' ? t('app:geoRepartition.editGeoRepartition'): t('app:geoRepartition.newGeoRepartition') }</DialogTitle>
            <DialogContent>
                {row.type !== 'delete' && <form noValidate autoComplete="off">
                    <TextField
                        id="name"
                        label={t('app:geoRepartition.name')}
                        value={currentData.name}
                        onChange={(event) => this.handleChangeForm(event, 'name')}
                        margin="normal"
                        fullWidth={true}
                        error = {Boolean(form.error && form.error.name)}
                        helperText={form.error && form.error.name}
                    />
                </form>}
                {row.type === 'delete' && <div>{ t('app:geoRepartition.deleteGeoRepartitionWarning')}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} color="primary">{t('crud.cancel')}</Button>
                {row.type !== 'delete' && <Button onClick={this.saveGeoRepartition} color="primary">{t('crud.save')}</Button>}
                {row.type === 'delete' && <Button onClick={this.saveGeoRepartition} color="primary">{t('crud.delete')}</Button>}
            </DialogActions>
        </Dialog>)
    }
}




export default GeoRepartitionForm;
