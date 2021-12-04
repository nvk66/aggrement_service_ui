import axios, {AxiosRequestConfig} from 'axios';
import TokenService from './token.service';
import userData from '../types/userData'

const host = 'http://localhost:8081/api/';

const instance = axios.create({
    baseURL: host,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = TokenService.getLocalAccessToken();
        if (token) {
            if (config.headers) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (res) => {
        return res;
    }, async (err) => {
        const originalConfig = err.config;

        console.log('originalConfig')
        console.log(originalConfig)

        if (originalConfig.url !== 'login' && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await instance.post<userData>('/auth/refresh_token', {
                        refreshToken: TokenService.getLocalRefreshToken(),
                    });

                    const refreshToken = rs.data.refreshToken as string;

                    TokenService.updateLocalAccessToken(refreshToken);

                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(err);
    }
);

export default instance;
