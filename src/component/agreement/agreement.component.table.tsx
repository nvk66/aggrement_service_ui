import {Switch} from "@mui/material";
import React, {useState, useEffect, useMemo, useRef, ChangeEvent} from "react";
import Pagination from "@material-ui/lab/Pagination";
import AgreementService from "../../service/agreement.service";
import AgreementData from "../../types/agreementData";
import UserData from "../../types/userData";
import {RouteComponentProps} from "react-router-dom";
import {Column, useTable} from "react-table";
import SearchType from "../../types/searchType";
import InputMask from "react-input-mask";
import ProviderService from "../../service/provider.service";
import MerchantService from "../../service/merchant.service";
import MerchantData from "../../types/merchantData";
import AgreementModal from "./agreement.modal";

type Search = {} & SearchType & AgreementData;

type Props = {} & RouteComponentProps;

type State = {
    agreements: Array<AgreementData>,
    filteredAgreements: Array<AgreementData>,
    currentAgreement: AgreementData | null,
    currentIndex: number,
    search: AgreementData | null,
    currentUser: UserData | null,
    redirect: string | null,
    page: number,
    count: number,
    size: number,
    pageSizes: Array<number>,
    totalPages: number
};

const AgreementsTable = (props: Props, state: State) => {
    const [agreements, setAgreements] = useState<Array<AgreementData>>([]);
    const agreementsRef = useRef<Array<AgreementData>>([]);
    const [pageSizes] = useState<Array<number>>([3, 20, 25]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selected, setSelected] = useState<AgreementData>({});
    const [merchants, setMerchants] = useState<Array<MerchantData>>([]);
    const [providers, setProviders] = useState<Array<MerchantData>>([]);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState<Search>({
        page: 1,
        size: 3
    });

    agreementsRef.current = agreements;

    const retrieveAgreements = () => {
        const params = getRequestParams(page, size);

        const requestString = prepareStringRequest(params);

        AgreementService.getAllAgreements(requestString)
            .then((response) => {
                setAgreements(response.data.content);
                setTotalPages(response.data.totalPages);

                console.log(response.data);
            }).catch((e) => {
            console.log(e);
        });
        findAllMerchants();
        findAllProviders();
    };

    useEffect(retrieveAgreements, [page, size]);

    const getRequestParams = (page: number, size: number) => {
        setSearch({page: 0, size: 0});

        if (page) {
            search.page = page - 1;
        }

        if (size) {
            search.size = size;
        }

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

    const refreshList = () => {
        retrieveAgreements();
    };

    const onBackdropClick = () => {
        setIsModalVisible(false)
    }

    const openAgreement = (rowIndex: number) => {
        setIsModalVisible(true);
        setSelected(agreementsRef.current[rowIndex]);
    };

    const createAgreement = () => {
        setIsModalVisible(true);
    }

    const deleteAgreement = (rowIndex: number) => {
        const id = agreementsRef.current[rowIndex].id;

        AgreementService.deleteAgreement(id)
            .then((response) => {
                // props.history.push("/agreementTable");
                let newAgreements: Array<AgreementData> = [...agreementsRef.current];
                newAgreements.splice(rowIndex, 1);

                setAgreements(newAgreements);

            }).catch((e) => {
            console.log(e);
        });
    };

    const getProvider = (rowIndex: number) => {
        const id = agreementsRef.current[rowIndex].providerId;

        let guid: any = '';

        ProviderService.getProvider(id)
            .then((response) => {
                guid = response.data.guid;
            }).catch((e) => {
            console.log(e);
        });
        return (
            <span>{guid}</span>
        );
    }

    const getMerchant = (rowIndex: number) => {
        const id = agreementsRef.current[rowIndex].merchantId;
        //
        // let guid: any = '';
        //
        // MerchantService.getMerchant(id)
        //     .then((response) => {
        //         guid = response.data.guid;
        //     }).catch((e) => {
        //     console.log(e);
        // });

        const merchant = merchants.find(merchant => merchant.id === id)

        const guid = merchant ? merchant.guid : '';

        console.log('!!!')
        console.log(guid)

        return (
            <span>{guid}</span>
        );
    }

    const findAllProviders = () => {
        ProviderService.getAll()
            .then((response) => {
                setProviders(response.data);
            }).catch((e) => {
            console.log(e);
        });

    }

    const findAllMerchants = () => {
        MerchantService.getAll()
            .then((response) => {
                setMerchants(response.data);
            }).catch((e) => {
            console.log(e);
        });
    }

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSize(Number(event.target.value));
        setPage(1);
    };

    const columns: Column<AgreementData>[] = useMemo(() => [
            // {
            //     Header: 'Merchant Guid',
            //     accessor: 'merchantId',
            //     Cell: (props) => {
            //         const rowIdx = Number(props.row.id);
            //         const merchant = merchants.find(merchant => merchant.id === agreementsRef.current[rowIdx].merchantId);
            //
            //         const guid = merchant ? merchant.guid : '';
            //
            //         return (
            //             <div>
            //                 <div>
            //                     {guid}
            //                 </div>
            //             </div>
            //         );
            //     },
            //     maxWidth: 200,
            //     minWidth: 100,
            //     width: 200
            // },
            // {
            //     Header: 'Provider Guid',
            //     accessor: 'providerId',
            //     Cell: (props) => {
            //         const rowIdx = Number(props.row.id);
            //         return (
            //             <div>
            //                 <div onLoad={() => getProvider(rowIdx)}>
            //                 </div>
            //             </div>
            //         );
            //     },
            //     maxWidth: 200,
            //     minWidth: 100,
            //     width: 200
            // },
            {
                Header: 'Description',
                accessor: 'description',
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
                Header: 'Status',
                accessor: 'status',
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
                            <span>Id: {agreementsRef.current[rowIdx].merchantId}</span>
                            <button
                                className="btn btn-outline-secondary ml-1"
                                type="button"
                                onClick={() => openAgreement(rowIdx)}
                            >
                                View
                            </button>
                            <button
                                className="btn btn-outline-secondary ml-1"
                                type="button"
                                onClick={() => deleteAgreement(rowIdx)}
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
    } = useTable<AgreementData>({
        columns,
        data: agreements,
    });

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <div className="mt-1">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={createAgreement}
                        >
                            Create
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
                <AgreementModal
                    onClose={onBackdropClick}
                    isModalVisible={isModalVisible}
                    agreementData={selected}
                    merchants={merchants}
                    providers={providers}

                />

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

export default AgreementsTable;
