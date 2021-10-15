import React, {ChangeEvent} from "react";
import LoginService from "../service/auth-service";
import LoginData from '../types/loginData';
import {RouteComponentProps} from "react-router-dom";
import {Formik, Field, Form, ErrorMessage} from "formik";
import * as Yup from "yup";
import './login.component.css';

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
            <div className="body-div">
                <header>
                    <span id="logo">неВсеПлатежи</span>
                </header>
                <main>
                    <div className="container">
                        <h1 className="login-h">Войти в Личный Кабинет</h1>
                        <form className="login-form">
                            <input type="text" className="login-input" name="login" placeholder="Логин"/>
                            <input type="text" className="login-input" name="password" placeholder="Пароль"/>
                            <input type="submit" className="login-btn" value="Войти"/>
                        </form>
                        <div className="login-links">
                            <a href="">Забыли пароль?</a>
                            <a href="">Зарегистрироваться</a>
                        </div>
                    </div>
                </main>

                <footer>
                    <p>с Copyright</p>
                </footer>
            </div>
        );
    }
}
