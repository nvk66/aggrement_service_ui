import {Component, ChangeEvent} from "react";
import ProviderService from "../../service/provider.service";
import {Link, Redirect} from "react-router-dom";
import ProviderData from '../../types/providerData';
import UserData from '../../types/userData';
import SendIcon from '@mui/icons-material/Send';
import AuthService from '../../service/auth.service'
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch} from "@mui/material";
import InputMask from 'react-input-mask';

type Props = {};

type State = {
    providers: Array<ProviderData>,
    filteredProviders: Array<ProviderData>,
    currentProvider: ProviderData | null,
    currentIndex: number,
    search: ProviderData | null,
    currentUser: UserData | null,
    redirect: string | null
};

export default class ProvidersList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.getAllProviders = this.getAllProviders.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveProvider = this.setActiveProvider.bind(this);
        this.onChangeSearchGuid = this.onChangeSearchGuid.bind(this);
        this.onChangeSearchName = this.onChangeSearchName.bind(this);
        this.onChangeSearchPhoneNumber = this.onChangeSearchPhoneNumber.bind(this);
        this.onChangeSearchIsActive = this.onChangeSearchIsActive.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            providers: [],
            filteredProviders: [],
            currentProvider: null,
            currentIndex: -1,
            search: null,
            currentUser: null,
            redirect: ''
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        console.log(currentUser);

        if (!currentUser) {
            this.setState({
                redirect: "/login"
            });
        } else {
            this.getAllProviders();

            this.setState({
                search: {
                    active: true
                }
            })
        }
    }

    onChangeSearchGuid(e: ChangeEvent<HTMLInputElement>) {
        const guid = e.target.value;

        this.setState({
            search: {
                guid: guid
            }
        });
    }

    onChangeSearchName(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.value;

        this.setState({
            search: {
                name: name
            }
        });
    }

    onChangeSearchPhoneNumber(e: ChangeEvent<HTMLInputElement>) {
        const phoneNumber = e.target.value;

        console.log(phoneNumber);

        this.setState({
            search: {
                phoneNumber: phoneNumber
            }
        });
    }

    onChangeSearchIsActive(e: ChangeEvent<HTMLInputElement>) {
        const isActive: boolean = Boolean(e.target.value);

        function filterProviders(isActive: boolean) {
            return [];
        }

        this.setState({
            search: {
                active: isActive
            },
            filteredProviders: filterProviders(isActive)
        });
    }

    getAllProviders() {
        ProviderService.getAllProviders()
            .then(response => {
                this.setState({
                    providers: response.data.content
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    refreshList() {
        this.getAllProviders();
        this.setState({
            currentProvider: null,
            currentIndex: -1
        });
    }

    setActiveProvider(provider: ProviderData, index: number) {
        this.setState({
            currentProvider: provider,
            currentIndex: index
        });
    }

    handleSwitch(provider: ProviderData) {

    }

    handleSearch() {
        this.setState({
            currentProvider: null,
            currentIndex: -1
        });

        console.log(this.state.search)

        // ProviderService.getAllProviders(this.state.search?.name)
        ProviderService.getAllProviders('')
            .then(response => {
                this.setState({
                    providers: response.data.content
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {search, providers, currentProvider, filteredProviders, currentIndex} = this.state;

        return (
            <div className="list row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Guid"
                            value={search?.guid ? search.guid : ''}
                            onChange={this.onChangeSearchGuid}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={search?.name ? search.name : ''}
                            onChange={this.onChangeSearchGuid}
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
                                   onChange={this.onChangeSearchPhoneNumber}>
                        </InputMask>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.handleSearch}
                                endIcon={<SendIcon />}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                    <div>
                        <FormControl component="fieldset">
                            <FormLabel
                                component="legend"
                                color="secondary"
                            >
                                Active
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-label="activity"
                                name="controlled-radio-buttons-group"
                                value={search?.active}
                                onChange={this.onChangeSearchIsActive}
                            >
                                <FormControlLabel value="true" control={<Radio/>} label="Active"/>
                                <FormControlLabel value="false" control={<Radio/>} label="Inactive"/>
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="input-group mb-3">

                    </div>
                    <div className="col-md-6">
                        <h4>Provider List</h4>
                        <table>

                        </table>

                        <ul className="list-group">
                            {providers &&
                            providers.map((provider: ProviderData, index: number) => (
                                <li
                                    className={
                                        "list-group-item " +
                                        (index === currentIndex ? "active" : "")
                                    }
                                    // onClick={() => this.setActiveTutorial(tutorial, index)}
                                    key={index}
                                >
                                    <div>
                                        <div>
                                            <Switch checked={!provider.active} color="secondary" />
                                        </div>
                                        <div>
                                            {provider.name}
                                        </div>
                                        <div>
                                            {provider.guid}
                                        </div>
                                        <div>
                                            {provider.phoneNumber}
                                        </div>
                                        <div>
                                            {provider.createdAt}
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                    {provider.name}
                                </li>
                            ))}
                        </ul>

                        {/*<button*/}
                        {/*    className="m-3 btn btn-sm btn-danger"*/}
                        {/*    onClick={this.removeAllTutorials}*/}
                        {/*>*/}
                        {/*    Remove All*/}
                        {/*</button>*/}
                    </div>
                    {/*<div className="col-md-6">*/}
                    {/*    {currentTutorial ? (*/}
                    {/*        <div>*/}
                    {/*            <h4>Tutorial</h4>*/}
                    {/*            <div>*/}
                    {/*                <label>*/}
                    {/*                    <strong>Title:</strong>*/}
                    {/*                </label>{" "}*/}
                    {/*                {currentTutorial.title}*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <label>*/}
                    {/*                    <strong>Description:</strong>*/}
                    {/*                </label>{" "}*/}
                    {/*                {currentTutorial.description}*/}
                    {/*            </div>*/}
                    {/*            <div>*/}
                    {/*                <label>*/}
                    {/*                    <strong>Status:</strong>*/}
                    {/*                </label>{" "}*/}
                    {/*                {currentTutorial.published ? "Published" : "Pending"}*/}
                    {/*            </div>*/}

                    {/*            <Link*/}
                    {/*                to={"/tutorials/" + currentTutorial.id}*/}
                    {/*                className="badge badge-warning"*/}
                    {/*            >*/}
                    {/*                Edit*/}
                    {/*            </Link>*/}
                    {/*        </div>*/}
                    {/*    ) : (*/}
                    {/*        <div>*/}
                    {/*            <br/>*/}
                    {/*            <p>Please click on a Tutorial...</p>*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}
