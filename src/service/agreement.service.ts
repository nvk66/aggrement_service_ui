import http from "../http-common";
import instance from "./api.service";
import agreementData from "../types/agreementData"

const agreementUrl = 'agreements/';

const getAgreement = (id: any) => {
    return instance
        .get(agreementUrl + id)
}

const deleteAgreement = (id: any) => {
    return instance
        .delete(agreementUrl + id)
}

const addAgreement = (agreement: agreementData) => {
    return instance
        .post(agreementUrl, agreement)
}

const updateAgreement = (id: any, agreement: agreementData) => {
    return instance
        .put(agreementUrl + id, agreement);
}

const getAllAgreements = (requestString?: string) => {
    return instance
        .get<{
            content: agreementData[],
            empty: boolean,
            first: boolean,
            last: boolean,
            number: number,
            numberOfElements: number,
            totalElements: number,
            totalPages: number,
        }>(agreementUrl + requestString);
}

const AgreementService = {
    getAllAgreements,
    addAgreement,
    updateAgreement,
    deleteAgreement,
    getAgreement,
};

export default AgreementService;
