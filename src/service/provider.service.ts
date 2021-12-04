import instance from "./api.service";
import providerData from "../types/providerData"

const providerUrl = 'providers/';

const getProvider = (id: any) => {
    return instance
        .get(providerUrl + id)
}

const deleteProvider = (id: any) => {
    return instance
        .delete(providerUrl + id)
}

const addProvider = (provider: providerData) => {
    return instance
        .post(providerUrl, provider)
}

const updateProvider = (id: any, provider: providerData) => {
    return instance
        .put(providerUrl + id, provider);
}

const changeActivity = (id: any) => {
    return instance
        .put<providerData>(providerUrl + 'activate/' + id);
}

const getAllProviders = (requestString?: string) => {
    return instance
        .get<{
            content: providerData[],
            empty: boolean,
            first: boolean,
            last: boolean,
            number: number,
            numberOfElements: number,
            totalElements: number,
            totalPages: number,
        }>(providerUrl + requestString);
}

const ProviderService = {
    getAllProviders,
    changeActivity,
    addProvider,
    updateProvider,
    deleteProvider,
    getProvider,
};

export default ProviderService;
