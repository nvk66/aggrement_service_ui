import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useEffect, useState} from "react";
import AgreementData from "../../types/agreementData";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import AgreementService from "../../service/agreement.service";
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import ProviderData from "../../types/providerData";
import MerchantData from "../../types/merchantData";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface AgreementModalProps {
    onClose: () => void;
    isModalVisible: boolean;
    agreementData: AgreementData;
    merchants: AgreementData[];
    providers: ProviderData[];
}

const AgreementModal: React.FC<AgreementModalProps> = ({
                                                           isModalVisible,
                                                           onClose,
                                                           agreementData,
                                                           merchants,
                                                           providers
                                                       }) => {
    const [agreement, setAgreement] = useState(agreementData);
    const [loading, setLoading] = useState(false);

    const handleChange = (prop: keyof AgreementData) => (event: SelectChangeEvent<any>) => {
        setAgreement({...agreement, [prop]: event.target.value});
    };

    const handleChangeNew = (prop: keyof AgreementData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgreement({...agreement, [prop]: event.target.value});
    };


    console.log(agreement)
    console.log(agreementData)

    const save = () => {
        setLoading(true);

        if (!agreement.id) {
            agreement.id = agreementData.id;
        }
        if (!agreement.merchantId) {
            agreement.merchantId = agreementData.merchantId;
        }
        if (!agreement.providerId) {
            agreement.providerId = agreementData.providerId;
        }
        if (!agreement.description) {
            agreement.description = agreementData.description;
        }
        if (!agreement.status) {
            agreement.status = agreementData.status;
        }

        agreement.id ?
            AgreementService.updateAgreement(agreement.id, agreement).then((response) => {
                // props.history.push("/agreementTable");
                setLoading(false);
                onClose();
            }).catch((e) => {
                setLoading(false);
                console.log(e);
            }) :
            AgreementService.addAgreement(agreement).then((response) => {
                // props.history.push("/agreementTable");
                setLoading(false);
                onClose();
            }).catch((e) => {
                setLoading(false);
                console.log(e);
            });
    }

    return (
        <Modal
            open={isModalVisible}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}
                 component="form"
                 autoComplete="off"
            >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {agreementData.id ? 'Update agreement' : 'Create agreement'}
                </Typography>
                <FormControl margin="normal" fullWidth>
                    <InputLabel id="searchTypeSelectLabel">Status</InputLabel>
                    <Select
                        labelId="searchTypeSelectLabel"
                        id="searchTypeSelect"
                        value={agreementData.status}
                        onChange={handleChange('status')}
                        label="Status"
                        sx={{minWidth: 150}}
                        required

                    >
                        <MenuItem value='DELETED'>{'DELETED'}</MenuItem>
                        <MenuItem value='REJECTED'>{'REJECTED'}</MenuItem>
                        <MenuItem value='APPROVED'>{'APPROVED'}</MenuItem>
                        <MenuItem value='CONSIDERED'>{'CONSIDERED'}</MenuItem>
                        <MenuItem value='DRAFT'>{'DRAFT'}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl margin="normal">
                    <InputLabel id="searchProviderSelectLabel">Provider</InputLabel>
                    <Select
                        labelId="searchProviderSelectLabel"
                        id="searchProviderSelect"
                        value={agreementData.providerId}
                        onChange={handleChange('providerId')}
                        label="Provider"
                        sx={{minWidth: 300}}
                        required
                    >
                        {providers.map((key: ProviderData) => (
                            <MenuItem value={key.id}>{key.guid}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl margin="normal" className="ml-3">
                    <InputLabel id="searchMerchantSelectLabel">Merchant</InputLabel>
                    <Select
                        labelId="searchMerchantSelectLabel"
                        id="searchMerchantSelect"
                        value={agreementData.merchantId}
                        onChange={handleChange('merchantId')}
                        label="Merchant"
                        sx={{minWidth: 300}}
                        required
                    >
                        {merchants.map((key: MerchantData) => (
                            <MenuItem value={key.id}>{key.guid}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div>
                    <TextField
                        required
                        id="description"
                        color="secondary"
                        label="Description"
                        defaultValue={agreementData.description}
                        fullWidth
                        margin="normal"
                        onChange={handleChangeNew('description')}
                    />
                </div>
                <div>
                    <LoadingButton
                        color="secondary"
                        onClick={save}
                        loading={loading}
                        loadingPosition="start"
                        variant="contained"
                    >
                        Save
                    </LoadingButton>
                </div>
            </Box>
        </Modal>
    );
};

export default AgreementModal;
