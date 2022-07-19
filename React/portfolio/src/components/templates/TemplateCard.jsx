import React from 'react';
import './newslettertemplates.css';
import debug from 'sabio-debug';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

function TemplateCard(props) {
    const _logger = debug.extend('TemplateCard');

    const aTemplate = props.template;

    _logger(aTemplate);

    const navigate = useNavigate();

    const onEditButtonClicked = () => {
        const templateObj = aTemplate;
        navigateToTemplateForm(templateObj);
    };

    const navigateToTemplateForm = (receivedTemplatesObj) => {
        const templateObjToSend = { type: 'EDIT_VIEW', payload: receivedTemplatesObj };
        navigate(`/newsletterstemplate/${receivedTemplatesObj.id}`, {
            state: templateObjToSend,
        });
    };

    const onDeleteButtonClicked = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                props.onTemplateClicked(props.template);
                Swal.fire('Deleted', '', 'success');
            } else {
                return;
            }
        });
    };

    const optionsWithClonOnOverlayclick = {
        closeOnOverlayClick: true,
    };

    return (
        <div className="col-md">
            <div className="templateCard h-98" style={{ width: '18rem' }}>
                <div className="card-body">
                    <h4 className="card-title">{aTemplate.name}</h4>
                    <img src={aTemplate.primaryImage} className="card-img-top" alt="not found" />
                    <h5 className="card-text">{aTemplate.description}</h5>
                    <button type="button" className="btn btn-success " onClick={onEditButtonClicked}>
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => onDeleteButtonClicked(optionsWithClonOnOverlayclick)}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
TemplateCard.propTypes = {
    template: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        primaryImage: PropTypes.string.isRequired,
    }),
    onTemplateClicked: PropTypes.func,
    onHide: PropTypes.func,
};

export default React.memo(TemplateCard);
