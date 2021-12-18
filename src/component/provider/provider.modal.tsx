import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useEffect, useState} from "react";
import ProviderData from "../../types/providerData";
import {Button, TextField} from "@mui/material";
import ProviderService from "../../service/provider.service";
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';

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

interface ProviderModalProps {
    onClose: () => void;
    isModalVisible: boolean;
    providerData: ProviderData;
}

const ProviderModal: React.FC<ProviderModalProps> = ({
                                                         isModalVisible,
                                                         onClose,
                                                         providerData,
                                                     }) => {
    const [provider, setProvider] = useState(providerData);
    const [loading, setLoading] = useState(false);

    const handleChange = (prop: keyof ProviderData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setProvider({...provider, [prop]: event.target.value});
    };

    console.log(provider)
    console.log(providerData)

    const save = () => {
        setLoading(true);

        if (!provider.id) {
            provider.id = providerData.id;
        }
        if (!provider.guid) {
            provider.guid = providerData.guid;
        }
        if (!provider.name) {
            provider.name = providerData.name;
        }
        if (!provider.phoneNumber) {
            provider.phoneNumber = providerData.phoneNumber;
        }

        provider.id ?
            ProviderService.updateProvider(provider.id, provider).then((response) => {
                // props.history.push("/providerTable");
                setLoading(false);
                onClose();
            }).catch((e) => {
                setLoading(false);
                console.log(e);

            }) :
            ProviderService.addProvider(provider).then((response) => {
                // props.history.push("/providerTable");
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
                    {providerData.guid ? 'Update provider' : 'Create provider'}
                </Typography>
                <div>
                    <TextField
                        required
                        id="guid"
                        color="secondary"
                        label="Guid"
                        defaultValue={providerData.guid}
                        margin="normal"
                        onChange={handleChange('guid')}
                    />
                </div>
                <div>
                    <TextField
                        required
                        id="name"
                        color="secondary"
                        label="Name"
                        defaultValue={providerData.name}
                        margin="normal"
                        onChange={handleChange('name')}
                    />
                </div>
                <div>
                    <TextField
                        required
                        id="phoneNumber"
                        color="secondary"
                        label="Phone Number"
                        defaultValue={providerData.phoneNumber}
                        margin="normal"
                        onChange={handleChange('phoneNumber')}
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

                {/*<Button></Button>*/}
                {/*<Typography id="modal-modal-title" variant="h6" component="h2">*/}
                {/*    Text in a modal*/}
                {/*</Typography>*/}
                {/*<Typography id="modal-modal-description" sx={{mt: 2}}>*/}
                {/*    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.*/}
                {/*</Typography>*/}
            </Box>
        </Modal>
    );
};

export default ProviderModal;
