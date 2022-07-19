import axios from 'axios';
import * as helper from './serviceHelpers';

const addTemplate = (payload) => {
    const config = {
        method: 'POST',
        url: `${helper.API_HOST_PREFIX}/api/newsletterstemplate/`,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const updateTemplate = (id, payload) => {
    const config = {
        method: 'PUT',
        url: `${helper.API_HOST_PREFIX}/api/newsletterstemplate/ ${id}`,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const deleteById = (id) => {
    const config = {
        method: 'DELETE',
        url: `${helper.API_HOST_PREFIX}/api/newsletterstemplate/` + id,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const pagination = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${helper.API_HOST_PREFIX}/api/newsletterstemplate/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const searchPagination = (pageIndex, pageSize, query) => {
    const config = {
        method: 'GET',
        url: `${helper.API_HOST_PREFIX}/api/newsletterstemplate/paginate/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const newsLetterServices = { addTemplate, updateTemplate, deleteById, pagination, searchPagination };

export default newsLetterServices;
