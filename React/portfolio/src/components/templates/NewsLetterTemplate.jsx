import React, { useState, useCallback, useEffect } from 'react';
import './newslettertemplates.css';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import debug from 'sabio-debug';
import newsLetterServices from '../../services/newsLetterTemplateService';
import TemplateCard from './TemplateCard';
import { Link } from 'react-router-dom';
import NewsLetterForm from './NewsLetterForm';

function NewsLetterTemplate() {
    const _logger = debug.extend('NewsletterTemplates');

    const [paginationData, setPaginationData] = useState({
        arrayOfTemplates: [],
        templateComponents: [],
        pageIndex: 0,
        pageSize: 12,
        countOfItems: 0,
        current: 1,
    });

    const [query, setQuery] = useState('');

    const searchPaginatedTemplatesSuccess = (data) => {
        let returnedArray = data.data.item.pagedItems;

        _logger(returnedArray, 'returnedArray');

        setPaginationData((prevState) => {
            const pd = { ...prevState };
            pd.arrayOfTemplates = returnedArray;
            pd.templateComponents = returnedArray.map(mapTemplates);
            pd.countOfItems = data.data.item.totalCount;
            return pd;
        });
    };

    const searchPaginatedTemplatesError = (error) => {
        _logger(error, 'searchPaginatedTemplates Error');
    };

    const onSearchFieldChanged = (e) => {
        const target = e.target;
        const value = target.value;

        setQuery(value);
    };

    const paginationClicked = (page) => {
        setPaginationData((prevState) => {
            let pag = { ...prevState };
            pag.current = page;
            pag.pageIndex = page - 1;
            return pag;
        });
    };

    useEffect(() => {
        if (query.length > 0) {
            newsLetterServices
                .searchPagination(paginationData.pageIndex, paginationData.pageSize, query)
                .then(searchPaginatedTemplatesSuccess)
                .catch(searchPaginatedTemplatesError);
        } else {
            newsLetterServices
                .pagination(paginationData.pageIndex, paginationData.pageSize)
                .then(getPaginatedTemplatesSuccess)
                .catch(getPaginatedTemplatesError);
        }
    }, [paginationData.pageIndex, query]);

    const getPaginatedTemplatesSuccess = (data) => {
        let returnedArray = data.data.item.pagedItems;

        _logger(returnedArray, 'returnedArray');

        setPaginationData((prevState) => {
            const pd = { ...prevState };
            pd.arrayOfTemplates = returnedArray;
            pd.templateComponents = returnedArray.map(mapTemplates);
            pd.countOfItems = data.data.item.totalCount;
            return pd;
        });
    };

    const getPaginatedTemplatesError = (error) => {
        _logger(error, 'getPaginatedTemplates Error');
    };

    const mapTemplates = (aTemplate) => {
        return <TemplateCard template={aTemplate} key={aTemplate.id} onTemplateClicked={onDeleteRequested} />;
    };

    const onDeleteRequested = useCallback((myTemplate, eObj) => {
        _logger(myTemplate.id, { myTemplate, eObj });

        const handler = getDeleteSuccessHandler(myTemplate.id);

        newsLetterServices.deleteById(myTemplate.id).then(handler).catch(onDeleteError);
    }, []);

    const getDeleteSuccessHandler = (idToBeDeleted) => {
        return () => {
            setPaginationData((prevState) => {
                const pd = { ...prevState };
                pd.arrayOfTemplates = [...pd.arrayOfTemplates];

                const indOf = pd.arrayOfTemplates.findIndex((person) => {
                    let result = false;

                    if (person.id === idToBeDeleted) {
                        result = true;
                    }

                    return result;
                });

                if (indOf >= 0) {
                    pd.arrayOfTemplates.splice(indOf, 1);
                    pd.templateComponents = pd.arrayOfTemplates.map(mapTemplates);
                }

                return pd;
            });
        };
    };
    const onDeleteError = (error) => {
        _logger(error);
    };

    return (
        <div className="m-3">
            <nav className="navbar tempnavbar">
                <div>
                    <Link
                        to="/newsletterstemplate/newtemplateform"
                        element={<NewsLetterForm></NewsLetterForm>}
                        className="btn btn-primary">
                        Add Template
                    </Link>
                </div>

                <div className="container-fluid">
                    <form className="d-flex" role="search">
                        <input
                            className="form-control me-2"
                            type="search"
                            name="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={query}
                            onChange={onSearchFieldChanged}
                        />
                    </form>
                    <Pagination
                        current={paginationData.current}
                        total={paginationData.countOfItems}
                        pageSize={paginationData.pageSize}
                        onChange={paginationClicked}></Pagination>
                </div>
            </nav>

            <div className=" containerForTitle">
                <h2>Newsletter Templates</h2>

                <div>
                    <div className="row topRow">{paginationData.templateComponents}</div>
                </div>
            </div>
        </div>
    );
}

export default NewsLetterTemplate;
