import {Switch} from "@mui/material";
import React, {useState, useEffect, useMemo, useRef, ChangeEvent} from "react";
import Pagination from "@material-ui/lab/Pagination";
import MerchantService from "../../service/merchant.service";
import MerchantData from "../../types/merchantData";
import UserData from "../../types/userData";
import {RouteComponentProps} from "react-router-dom";
import {Column, useTable} from "react-table";
import SearchType from "../../types/searchType";
import InputMask from "react-input-mask";
import MerchantModal from "./merchant.modal";

type Search = {} & SearchType & MerchantData;

type Props = {} & RouteComponentProps;

type State = {
    merchants: Array<MerchantData>,
    filteredMerchants: Array<MerchantData>,
    currentMerchant: MerchantData | null,
    currentIndex: number,
    search: MerchantData | null,
    currentUser: UserData | null,
    redirect: string | null,
    page: number,
    count: number,
    size: number,
    pageSizes: Array<number>,
    totalPages: number
};

const MerchantsTable = (props: Props, state: State) => {
    const [merchants, setMerchants] = useState<Array<MerchantData>>([]);
    const merchantsRef = useRef<Array<MerchantData>>([]);
    const [pageSizes] = useState<Array<number>>([3, 20, 25]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selected, setSelected] = useState<MerchantData>({});

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState<Search>({
        page: 1,
        size: 3
    })

    merchantsRef.current = merchants;

    const retrieveMerchants = () => {
        const params = getRequestParams(page, size);

        const requestString = prepareStringRequest(params);

        MerchantService.getAllMerchants(requestString)
            .then((response) => {
                setMerchants(response.data.content);
                setTotalPages(response.data.totalPages);

                console.log(response.data);
            }).catch((e) => {
            console.log(e);
        });
    };

    useEffect(retrieveMerchants, [page, size]);

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
        const id = merchantsRef.current[rowIndex].id;

        MerchantService.changeActivity(id)
            .then((response) => {
                // props.history.push("/merchantTable");
                let newMerchants: Array<MerchantData> = [...merchantsRef.current];
                newMerchants[rowIndex] = response.data;
                setMerchants(newMerchants);
            }).catch((e) => {
            console.log(e);
        });
    };

    const refreshList = () => {
        retrieveMerchants();
    };

    const findByTitle = () => {
        setPage(1);
        retrieveMerchants();
    };

    const onBackdropClick = () => {
        setIsModalVisible(false)
    }

    const openMerchant = (rowIndex: number) => {
        // const id = merchantsRef.current[rowIndex].id;
        //
        // props.history.push("/merchants/" + id);
        setIsModalVisible(true);
        setSelected(merchantsRef.current[rowIndex]);
        // return (
        //     <MerchantModal onClose={onBackdropClick} isModalVisible={isModalVisible} />
        // );
    };

    const createMerchant = () => {
        setIsModalVisible(true);
    }

    const deleteMerchant = (rowIndex: number) => {
        const id = merchantsRef.current[rowIndex].id;

        MerchantService.deleteMerchant(id)
            .then((response) => {
                // props.history.push("/merchantTable");
                let newMerchants: Array<MerchantData> = [...merchantsRef.current];
                newMerchants.splice(rowIndex, 1);

                setMerchants(newMerchants);

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

    const columns: Column<MerchantData>[] = useMemo(() => [
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
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => openMerchant(rowIdx)}
                            >
                                Change
                            </button>
                            <button
                                className="btn btn-outline-secondary ml-1"
                                type="button"
                                onClick={() => deleteMerchant(rowIdx)}
                            >
                                Delete
                            </button>
                        </div>
                    );
                },
                maxWidth: 400,
                minWidth: 100,
                width: 300
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
    } = useTable<MerchantData>({
        columns,
        data: merchants,
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

        function filterMerchants(isActive: boolean) {
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
        //     filteredMerchants: filterMerchants(isActive)
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
                    <InputMask mask='+7(999) 999 9999'
                               className="form-control"
                               placeholder="Phone number"
                               value={search?.phoneNumber ? search.phoneNumber : ''}
                               onChange={onChangeSearchPhoneNumber}>
                    </InputMask>
                </div>
                <div className="input-group mb-3">
                    <div className="input-group">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByTitle}
                        >
                            Search
                        </button>
                    </div>
                    <div className="mt-1">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={createMerchant}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>

            {/*<div>*/}
            {/*    <div className="input-group mb-3">*/}
            {/*        <Button*/}
            {/*            color="secondary"*/}
            {/*            onClick={createMerchant}*/}
            {/*            variant="contained"*/}
            {/*        >*/}
            {/*            Create*/}
            {/*        </Button>*/}
            {/*        /!*<button*!/*/}
            {/*        /!*    className="btn btn-outline-secondary"*!/*/}
            {/*        /!*    type="button"*!/*/}
            {/*        /!*    onClick={openMerchant(-1)}*!/*/}
            {/*        /!*>*!/*/}
            {/*        /!*    Create*!/*/}
            {/*        /!*</button>*!/*/}
            {/*    </div>*/}
            {/*</div>*/}


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
                <MerchantModal onClose={onBackdropClick} isModalVisible={isModalVisible} merchantData={selected}/>

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

export default MerchantsTable;
