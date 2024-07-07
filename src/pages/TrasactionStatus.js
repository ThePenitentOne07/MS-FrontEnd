import React, { useEffect } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import apiService from '../app/apiService';

function TransactionStatus() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

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
                        <>
                            Your order number is
                            <strong>&nbsp;#140396</strong>. We have emailed your order
                            confirmation and will update you once it&apos;s shipped.
                        </>
                    ) : (
                        'Your transaction could not be completed. Please try again or contact support.'
                    )}
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        alignSelf: 'start',
                        width: { xs: '100%', sm: 'auto' },
                    }}
                >
                    Go to my orders
                </Button>
            </Stack>
        </>
    );
}

export default TransactionStatus;
