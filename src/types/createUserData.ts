export default interface CreateUserData {
    login: string,
    password: string,
    repeatPassword: string,
    roles: string[]
}