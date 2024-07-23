import React, { useEffect } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../app/apiService';

function TransactionStatus() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const amount = params.get('vnp_Amount');
    const bankCode = params.get('vnp_BankCode');
    const bankTranNo = params.get('vnp_BankTranNo');
    const cardType = params.get('vnp_CardType');
    const orderInfo = params.get('vnp_OrderInfo');
    const payDate = params.get('vnp_PayDate');
    const transactionNo = params.get('vnp_TransactionNo');
    const transactionStatus = params.get('vnp_TransactionStatus');
    const txnRef = params.get('vnp_TxnRef');
    const responseCode = params.get('vnp_ResponseCode');

    const data = {
        amount,
        bankCode,
        bankTranNo,
        cardType,
        orderInfo,
        payDate,
        transactionNo,
        transactionStatus,
        txnRef,
        responseCode,
    };
    const handleButton = () => {
        navigate(`/orderstatus/${txnRef}`)
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        const sendReq = async () => {
            try {
                await apiService.post('/api/payment/vnpay-callback', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.log('Error sending request:', error);
            }
        };
        sendReq();
    }, [data]);

    const isSuccess = responseCode === '00';

    return (
        <>
            <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">
                    {isSuccess ? 'Giao dịch thành công' : 'Giao dịch thất bại'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {isSuccess ? (
                        <Stack>
                            Mã đơn của bạn là:
                            <strong>&nbsp;{txnRef}</strong>.
                            <Button
                                variant="contained"
                                onClick={handleButton}
                                sx={{
                                    alignSelf: 'start',
                                    width: { xs: '100%', sm: 'auto' },
                                }}
                            >
                                Đi tới đơn của tôi
                            </Button>
                        </Stack>
                    ) : (
                        ""
                    )}
                </Typography>


            </Stack>
        </>
    );
}

export default TransactionStatus;
