import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useEffect, useState} from "react";
import MerchantData from "../../types/merchantData";
import {Button, TextField} from "@mui/material";
import MerchantService from "../../service/merchant.service";
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

// export interface LoginArgs {
//     password: string;
//     login: string;
// }
//
// export type LoginFunction = (args: LoginArgs) => Promise<void>;
//
interface MerchantModalProps {
    onClose: () => void;
    isModalVisible: boolean;
    merchantData: MerchantData;

    // loginError?: string;
    // onLoginRequested: LoginFunction;
}

const MerchantModal: React.FC<MerchantModalProps> = ({
                                                         isModalVisible,
                                                         onClose,
                                                         merchantData,
                                                     }) => {
    const [merchant, setMerchant] = useState(merchantData);
    const [loading, setLoading] = useState(false);

    const handleChange = (prop: keyof MerchantData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setMerchant({...merchantData, [prop]: event.target.value});
    };

    console.log(merchant)
    console.log(merchantData)

    const save = () => {
        setLoading(true);

        if (!merchant) {
            setMerchant(merchantData);
        }

        // MerchantService.changeActivity(id)
        //     .then((response) => {
        //         // props.history.push("/merchantTable");
        //         let newMerchants: Array<MerchantData> = [...merchantsRef.current];
        //         newMerchants[rowIndex] = response.data;
        //         setMerchants(newMerchants);
        //     }).catch((e) => {
        //     console.log(e);
        // });
        merchant.id ?
            MerchantService.updateMerchant(merchant.id, merchant).then((response) => {
                // props.history.push("/merchantTable");
                setLoading(false);
                onClose();
            }).catch((e) => {
                setLoading(false);
                console.log(e);

            }) :
            MerchantService.addMerchant(merchant).then((response) => {
                // props.history.push("/merchantTable");
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
                    {merchantData.guid ? 'Update merchant' : 'Create merchant'}
                </Typography>
                <div>
                    <TextField
                        required
                        id="guid"
                        color="secondary"
                        label="Guid"
                        defaultValue={merchantData.guid}
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
                        defaultValue={merchantData.name}
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
                        defaultValue={merchantData.phoneNumber}
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

export default MerchantModal;
