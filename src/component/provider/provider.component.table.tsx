import React, {useState, useEffect, useMemo, useRef, ChangeEvent} from "react";
import Pagination from "@material-ui/lab/Pagination";
import ProviderService from "../../service/provider.service";
import ProviderData from "../../types/providerData";
import UserData from "../../types/userData";
import {RouteComponentProps} from "react-router-dom";
import {Column, useTable} from "react-table";
import {Switch} from "@mui/material";
import SearchType from "../../types/searchType";
import InputMask from "react-input-mask";

type Search = {} & SearchType & ProviderData;

type Props = {} & RouteComponentProps;

type State = {
    providers: Array<ProviderData>,
    filteredProviders: Array<ProviderData>,
    currentProvider: ProviderData | null,
    currentIndex: number,
    search: ProviderData | null,
    currentUser: UserData | null,
    redirect: string | null,
    page: number,
    count: number,
    size: number,
    pageSizes: Array<number>,
    totalPages: number
};

const ProvidersTable = (props: Props, state: State) => {
    const [providers, setProviders] = useState<Array<ProviderData>>([]);
    const providersRef = useRef<Array<ProviderData>>([]);
    const [pageSizes] = useState<Array<number>>([3, 20, 25])

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState<Search>({
        page: 1,
        size: 3
    })

    providersRef.current = providers;

    const retrieveProviders = () => {
        const params = getRequestParams(page, size);

        const requestString = prepareStringRequest(params);

        ProviderService.getAllProviders(requestString)
            .then((response) => {
                setProviders(response.data.content);
                setTotalPages(response.data.totalPages);

                console.log(response.data);
            }).catch((e) => {
            console.log(e);
        });
    };

    useEffect(retrieveProviders, [page, size]);

    const getRequestParams = (page: number, size: number) => {
        // let params = {page, size};

        setSearch({page: 0, size: 0});

        // let search: Search = {page: 0, size: 0};

        // if (searchTitle) {
        //     params["title"] = searchTitle;
        // }

        if (page) {
            search.page = page - 1;
            // params['page'] = page - 1;
        }

        if (size) {
            search.size = size;
            // params['size'] = size;
        }

        // return params;
        return search;
    };

    const prepareStringRequest = (search: Search) => {
        let requestString = '?';

        Object.entries(search).forEach((value, key, map) => {
            if (value) {
                requestString += `${value[0]}=${value[1]}&`;
            }
        })

        if (requestString.endsWith('&')) {
            requestString = requestString.substr(0, requestString.length - 1);
        }

        console.log(requestString)

        return requestString;
    }

    const handleActivityChange = (rowIndex: number) => {
        const id = providersRef.current[rowIndex].id;

        ProviderService.changeActivity(id)
            .then((response) => {
                // props.history.push("/providerTable");
                let newProviders: Array<ProviderData> = [...providersRef.current];
                newProviders[rowIndex] = response.data;
                setProviders(newProviders);
            }).catch((e) => {
            console.log(e);
        });
    };

    const refreshList = () => {
        retrieveProviders();
    };

    const findByTitle = () => {
        setPage(1);
        retrieveProviders();
    };

    const openProvider = (rowIndex: number) => {
        const id = providersRef.current[rowIndex].id;

        props.history.push("/providers/" + id);
    };

    const deleteProvider = (rowIndex: number) => {
        const id = providersRef.current[rowIndex].id;

        ProviderService.deleteProvider(id)
            .then((response) => {
                props.history.push("/providerTable");
                let newProviders: Array<ProviderData> = [...providersRef.current];
                newProviders.splice(rowIndex, 1);

                setProviders(newProviders);

            }).catch((e) => {
            console.log(e);
        });
    };

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSize(Number(event.target.value));
        setPage(1);
    };

    const columns: Column<ProviderData>[] = useMemo(() => [
            {
                Header: 'Activity',
                accessor: 'active',
                Cell: props => {
                    const rowIdx = Number(props.row.id);
                    const activity = props.cell.row.original.active;
                    return (
                        <div>
                            <Switch checked={activity} onChange={() => handleActivityChange(rowIdx)} color="secondary"/>
                        </div>
                    );
                },
                maxWidth: 120,
                minWidth: 80,
                width: 100
            },
            {
                Header: 'Guid',
                accessor: 'guid',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Phone number',
                accessor: 'phoneNumber',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Name',
                accessor: 'name',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'CreatedAt',
                accessor: 'createdAt',
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
            {
                Header: 'Actions',
                accessor: 'id',
                Cell: (props) => {
                    const rowIdx = Number(props.row.id);
                    return (
                        <div>
                            <span onClick={() => openProvider(rowIdx)}>
                                <i className="far fa-edit action mr-2"/>vjvj
                            </span>

                            <span onClick={() => deleteProvider(rowIdx)}>
                                <i className="fas fa-trash action"/>bb
                            </span>
                        </div>
                    );
                },
                maxWidth: 200,
                minWidth: 100,
                width: 200
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<ProviderData>({
        columns,
        data: providers,
    });

    const onChangeSearchGuid = (e: ChangeEvent<HTMLInputElement>) => {
        const guid = e.target.value;

        setSearch({
            ...search,
            guid: guid
        })
    }

    const onChangeSearchName = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;

        setSearch({
            ...search,
            name: name
        })
    }

    const onChangeSearchPhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
        const phoneNumber = e.target.value;

        setSearch({
            ...search,
            phoneNumber: phoneNumber
        })
    }

    const onChangeSearchIsActive = (e: ChangeEvent<HTMLInputElement>) => {
        const isActive: boolean = Boolean(e.target.value);

        function filterProviders(isActive: boolean) {
            return [];
        }

        setSearch({
            ...search,
            active: isActive
        })

        // this.setState({
        //     search: {
        //         active: isActive
        //     },
        //     filteredProviders: filterProviders(isActive)
        // });
    }


    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Guid"
                        value={search?.guid ? search.guid : ''}
                        onChange={onChangeSearchGuid}
                    />
                </div>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={search?.name ? search.name : ''}
                        onChange={onChangeSearchName}
                    />
                </div>
                <div className="input-group mb-3">
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    className="form-control"*/}
                    {/*    placeholder="Phone number"*/}
                    {/*    value={search?.phoneNumber ? search.phoneNumber : ''}*/}
                    {/*    onChange={this.onChangeSearchPhoneNumber}*/}
                    {/*/>*/}
                    <InputMask mask='+4(999) 999 9999'
                               className="form-control"
                               placeholder="Phone number"
                               value={search?.phoneNumber ? search.phoneNumber : ''}
                               onChange={onChangeSearchPhoneNumber}>
                    </InputMask>
                </div>
                <div className="input-group mb-3">
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    className="form-control"*/}
                    {/*    placeholder="Search by title"*/}
                    {/*    value={searchTitle}*/}
                    {/*    onChange={onChangeSearchTitle}*/}
                    {/*/>*/}
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByTitle}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-md-12 list">
                <div className="mt-3">
                    {"Items per Page: "}
                    <select onChange={handleSizeChange} value={size}>
                        {pageSizes.map((size: number) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>

                    <Pagination
                        className="my-3"
                        count={totalPages}
                        page={page}
                        siblingCount={1}
                        boundaryCount={1}
                        variant="outlined"
                        // shape="rounded"
                        onChange={handlePageChange}
                        color="secondary"
                    />
                </div>

                <table
                    {...getTableProps()}
                >
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps({
                            style: {
                                textAlign: 'center'
                            }
                        })}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps({
                                            style: {
                                                minWidth: cell.column.minWidth,
                                                width: cell.column.width,
                                                textAlign: 'center'
                                            },
                                        })}>{cell.render('Cell')}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProvidersTable;
