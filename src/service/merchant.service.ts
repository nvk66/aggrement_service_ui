import instance from "./api.service";
import merchantData from "../types/merchantData"

const merchantUrl = 'merchants/';

const getMerchant = (id: any) => {
    return instance
        .get<merchantData>(merchantUrl + id)
}

const getAll = () => {
    return instance
        .get<merchantData[]>(merchantUrl + 'all')
}

const deleteMerchant = (id: any) => {
    return instance
        .delete(merchantUrl + id)
}

const addMerchant = (merchant: merchantData) => {
    return instance
        .post(merchantUrl, merchant)
}

const updateMerchant = (id: any, merchant: merchantData) => {
    return instance
        .put(merchantUrl + id, merchant);
}

const changeActivity = (id: any) => {
    return instance
        .put<merchantData>(merchantUrl + 'activate/' + id);
}

const getAllMerchants = (requestString?: string) => {
    return instance
        .get<{
            content: merchantData[],
            empty: boolean,
            first: boolean,
            last: boolean,
            number: number,
            numberOfElements: number,
            totalElements: number,
            totalPages: number,
        }>(merchantUrl + requestString);
}

const MerchantService = {
    getAllMerchants,
    changeActivity,
    addMerchant,
    updateMerchant,
    deleteMerchant,
    getMerchant,
    getAll,
};

export default MerchantService;
