import React, { useState, useEffect } from 'react';
import debug from 'sabio-debug';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Row, Col } from 'react-bootstrap';
import newsLetterServices from '../../services/newsLetterTemplateService';
import PropTypes from 'prop-types';
import newsLetterTemplateSchema from '../../schema/NewsLetterTemplateSchema';
import FileUploader from '../fileuploader/FileUploader';

function NewsLetterForm() {
    const _logger = debug.extend('TemplatesForm');
    const [templatesData, setTemplatesData] = useState({
        formData: {
            id: '',
            name: '',
            description: '',
            primaryImage: '',
        },
    });

    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();
    const [templateId, setTemplateId] = useState({ id: '' });

    useEffect(() => {
        _logger('UseEffect Firing');

        setTemplateId(id);
        if (state) {
            setTemplatesData((prevState) => {
                let tp = { ...prevState };
                tp.formData.id = id;
                tp.formData.name = state.payload.name;
                tp.formData.description = state.payload.description;
                tp.formData.primaryImage = state.payload.primaryImage;

                return tp;
            });
        }
    }, []);

    const submitForm = (values) => {
        _logger('Submitting Form');
        _logger('submit form values', values);
        _logger(templateId, 'Id being passed');
        if (templateId === undefined) {
            _logger('id not detected, adding new Template');
            newsLetterServices.addTemplate(values).then(onAddTemplateSuccess).catch(onAddTemplateError);
        } else {
            _logger('id detected, updating Template');
            newsLetterServices
                .updateTemplate(templatesData.formData.id, values)
                .then(onUpdateTemplateSuccess)
                .catch(onUpdateTemplateError);
        }
    };

    const onAddTemplateSuccess = (response) => {
        _logger(response, 'Template Add Success');
        toastr.success('You have successfully added a template', 'Newsletter Template Added');

        let returnedResponse = response.data.item;
        setTemplatesData((prevState) => {
            const form = { ...prevState };
            form.formData.id = returnedResponse;
            return form;
        });
        navigate('/newsletterstemplate');
    };
    const onAddTemplateError = (error) => {
        _logger(error, 'Template Add Error');
        toastr.error('You were unsuccessful to add a Template', 'Failed To Add Newsletter Template');
    };

    const onUpdateTemplateSuccess = (response) => {
        _logger(response, 'Update Template Success');
        toastr.success('You have successfully updated a Template', 'Newsletter Template Updated');
        navigate('/newsletterstemplate');
    };

    const onUpdateTemplateError = (error) => {
        _logger(error, 'Update Template Error');
        toastr.error('You were unsuccessful to update a Template', 'Failed To Update Newsletter Template');
    };

    const conRendering = () => {
        if (templatesData.formData.id === '') {
            return <h3>Add New Template</h3>;
        } else {
            return <h3>Update NewsLetter Template</h3>;
        }
    };

    return (
        <Row className="m-3">
            <Col>
                <div>
                    <div className="card p-3">
                        <Formik
                            enableReinitialize={true}
                            initialValues={templatesData.formData}
                            onSubmit={submitForm}
                            validationSchema={newsLetterTemplateSchema}>
                            {(props) => {
                                const { values, handleChange, setFieldValue } = props;
                                const onFileUploadSuccess = (data) => {
                                    const theUploafSuccess = data.items[0].url;
                                    setFieldValue('primaryImage', theUploafSuccess);
                                };
                                return (
                                    <Form>
                                        <div>{conRendering()}</div>
                                        <div className="form-group ">
                                            <label htmlFor="name">Title</label>
                                            <Field
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                value={values.name}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="name" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="description">Description</label>
                                            <Field
                                                type="text"
                                                name="description"
                                                className="form-control"
                                                value={values.description}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="description" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <FileUploader
                                                name="primaryImage"
                                                value={values.primaryImage}
                                                onHandleUploadSuccess={onFileUploadSuccess}
                                            />
                                            {/* <ErrorMessage name="primaryImage" component="div" className="text-danger" /> */}
                                        </div>

                                        <br />

                                        <div className="btn text-center col-md-12">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </Col>
        </Row>
    );
}

NewsLetterForm.propTypes = {
    values: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        primaryImage: PropTypes.string.isRequired,
    }),
    handleChange: PropTypes.func,
    func: PropTypes.func,
    setFieldValue: PropTypes.func,
};

export default NewsLetterForm;
