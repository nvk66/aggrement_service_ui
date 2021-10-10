export default interface UserData {
    id?: any | null,
    login?: string | null,
    accessToken?: string | null,
    refreshToken?: string | null,
    roles?: Array<string>
}