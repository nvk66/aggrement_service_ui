import userData from '../types/userData'

const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem('user') as string);
    return user?.refreshToken;
};

const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem('user') as string);
    return user?.accessToken;
};

const updateLocalAccessToken = (token: string) => {
    let user = JSON.parse(localStorage.getItem('user') as string);
    user.accessToken = token;
    localStorage.setItem('user', JSON.stringify(user));
};

const getUser = () => {
    return JSON.parse(localStorage.getItem('user') as string);
};

const setUser = (user: userData) => {
    console.log(JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
};

const removeUser = () => {
    localStorage.removeItem('user');
};

const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
};

export default TokenService;
