import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';



import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';





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

export default class CellButtons extends React.Component {
    constructor(props) {
        super(props);


    }

    invokeParentMethod=(type) =>{
        this.props.context.componentParent.handleClickButtons(type,this.props.data)
    };

    render() {
        const { classes } = this.props;

        return (<div style={{display: 'flex'}}>
                <EditButton onExecute={() => {
                    this.invokeParentMethod('edit');
                }}/>
                <DeleteButton onExecute={() => {
                    this.invokeParentMethod('delete');
                }}/>
            </div>

        );
    }
}



