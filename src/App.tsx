import React, {Component} from "react";
import {Switch, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// import AuthVerify from "./common/auth-verify"
import AuthService from "./service/auth.service";
import UserData from './types/userData';

import Login from "./component/login.component";
import Merchant from "./component/merchant/merchant.component";
import Provider from "./component/provider/provider.component";

import EventBus from "./common/EventBus";
import MerchantsTable from "./component/merchant/merchant.component.table";
import ProvidersTable from "./component/provider/provider.component.table";
import AgreementsTable from "./component/agreement/agreement.component.table";

type Props = {};

type State = {
    hasAccess: boolean,
    currentUser: UserData | undefined
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            hasAccess: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: {
                    login: user.login,
                    roles: user.roles,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken
                },
                hasAccess: user.roles.includes(''), //todo добавить список ролей
                // showLogout: true
            });
        }

        EventBus.on("logout", this.logOut);
    }

    componentWillUnmount() {
        EventBus.remove("logout", this.logOut);
    }

    logOut() {
        AuthService.logout();
        this.setState({
            hasAccess: false,
            currentUser: undefined,
        });
    }

    render() {
        const {currentUser, hasAccess} = this.state;

        return (
            <div>
                {currentUser ?
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        {/*<Link to="/" className="navbar-brand">*/}
                        {/*    неВсеПлатежи*/}
                        {/*</Link>*/}
                        {/*<div className="navbar-nav mr-auto">*/}
                        {/*    <li className="nav-item">*/}
                        {/*        <Link to="/home" className="nav-link">*/}
                        {/*            Home*/}
                        {/*        </Link>*/}
                        {/*    </li>*/}
                        {/*</div>*/}

                        {/*<div className="navbar-nav ml-auto">*/}
                        {/*    <li className="nav-item">*/}
                        {/*        {currentUser ? (*/}
                        {/*            <a href="/login" className="nav-link" onClick={this.logOut}>*/}
                        {/*                LogOut*/}
                        {/*            </a>*/}
                        {/*        ) : (*/}
                        {/*            <a href="/login" className="nav-link" onClick={this.logOut}>*/}
                        {/*                LogOut*/}
                        {/*            </a>)*/}
                        {/*        }*/}
                        {/*    </li>*/}
                        {/*</div>*/}
                    </nav> : (<div/>)
                }

                <div className="container mt-3">
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/merchant" component={Merchant}/>
                        <Route exact path="/merchantTable" component={MerchantsTable}/>
                        <Route exact path="/providerTable" component={ProvidersTable}/>
                        <Route exact path="/agreementTable" component={AgreementsTable}/>
                        <Route exact path="/provider" component={Provider}/>
                    </Switch>
                </div>

                {/*{<AuthVerify logOut={this.logOut}/>}*/}
            </div>
        );
    }
}

export default App;
