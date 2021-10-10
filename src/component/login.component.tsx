import React, {ChangeEvent} from "react";
import LoginService from "../service/auth-service";
import LoginData from '../types/loginData';
import {RouteComponentProps} from "react-router-dom";
import {Formik, Field, Form, ErrorMessage} from "formik";
import * as Yup from "yup";

interface RouterProps {
    history: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = LoginData & {
    message: '',
    loading: boolean
};

export default class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            login: '',
            password: '',
            loading: false,
            message: ''
        };
    }

    validationSchema() {
        return Yup.object().shape({
            login: Yup.string().required("Login is required!"),
            password: Yup.string().required("Password is required!"),
        });
    }

    handleLogin(formValue: { login: string; password: string }) {
        const {login, password} = formValue;

        const auth = {
            login: login,
            password: password
        }

        this.setState({
            message: '',
            loading: true
        });


        LoginService.login(auth).then(
            () => {
                this.props.history.push("/profile");
                window.location.reload();
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
    }


    onChangeLogin(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            login: e.target.value
        });
    }

    onChangePassword(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            password: e.target.value
        });
    }

    render() {
        const {loading, message} = this.state;

        const initialValues = {
            login: '',
            password: '',
        };

        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Formik
                        initialValues={initialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleLogin}
                    >
                        <Form>
                            <div className="form-group">
                                <label htmlFor="login">Login</label>
                                <Field name="login" type="text" className="form-control"/>
                                <ErrorMessage
                                    name="login"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className="form-control"/>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"/>
                                    )}
                                    <span>Login</span>
                                </button>
                            </div>

                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }
}
