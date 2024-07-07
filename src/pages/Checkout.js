import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import axios from 'axios';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import AddressForm from '../components/checkout/AddressForm';
import getCheckoutTheme from '../components/checkout/getCheckoutTheme';
import Info from '../components/checkout/Info';
import InfoMobile from '../components/checkout/InfoMobile';
import Review from '../components/checkout/Review';
import apiService from '../app/apiService';
import { useState } from 'react';

const steps = ['Thông tin người dùng', 'Thông tin đơn hàng'];

const logoStyle = {
  width: '140px',
  height: '56px',
  marginLeft: '-4px',
  marginRight: '-8px',
};

function getStepContent(step, district, setDistrict, orderId) {
  switch (step) {
    case 0:
      return <AddressForm district={district} setDistrict={setDistrict} />;
    case 1:
      return <Review orderId={orderId} />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Checkout() {
  const [mode, setMode] = React.useState('light');
  const [district, setDistrict] = useState('');
  const [showCustomTheme, setShowCustomTheme] = React.useState(false);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0.00);
  const [cartId, setCartId] = React.useState("");
  const [orderId, setOrderId] = React.useState("");

  const handleNext = async () => {
    if (activeStep === steps.length - 2) {
      const savedUser = JSON.parse(localStorage.getItem('user'));

      if (!savedUser || !savedUser.id) {
        console.error('User ID not found in local storage');
        return;
      }

      const userId = savedUser.id;
      const receiverName = document.getElementById('fullName').value;
      const shippingAddress = document.getElementById('address').value + ' ' + district;
      const receiverPhoneNumber = document.getElementById('telNo').value;
      const token = localStorage.getItem("token");

      const orderData = {
        shippingAddress,
        totalPrice,
        receiverName,
        receiverPhoneNumber
      };


      try {
        const responseOrder = await apiService.post(`api/orders/${userId}`, orderData, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        // console.log('Order placed successfully');
        const newOrderId = responseOrder.data.result.id;
        setOrderId(newOrderId);

        setActiveStep(activeStep + 1);

        // Fetch order details after updating cartId
        try {
          const responseOrderDetail = await apiService.get(`/api/orders/${newOrderId}`, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          // console.log(responseOrderDetail.data);
        } catch (error) {
          console.error('Error fetching order details:', error);
        }

      } catch (error) {
        console.error('Error placing order:', error);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
    if (activeStep === steps.length - 1) {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const userId = savedUser.id;
      const token = localStorage.getItem("token");
      const amount = Math.round(parseFloat(totalPrice)); // Convert to long integer

      try {
        const responsePayment = await apiService.post(
          `/api/payment/pay/${orderId}`,
          { amount: amount * 10000 }, // Ensure amount is a long integer
          {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          }
        );
        const url = responsePayment.data.result.paymentUrl;
        // console.log(url);
        //vnp_ResponseCode=00
        window.location.href = url;


      } catch (error) {
        // console.log('Error')
      }
    }
  };

  // console.log(orderId)
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  // console.log(totalPrice)
  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>

      <Grid container sx={{ height: { xs: '100%', sm: '100dvh' }, mb: 3 }}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'end',
              height: 50,
            }}
          >
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: 500,
            }}
          >
            <Info totalPrice={totalPrice} setTotalPrice={setTotalPrice} setCartId={setCartId} />
          </Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'space-between', md: 'flex-end' },
              alignItems: 'center',
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                component="a"
                href="/material-ui/getting-started/templates/landing-page/"
                sx={{ alignSelf: 'start' }}
              >
                Back to
                <img
                  src={
                    'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg'
                  }
                  style={logoStyle}
                  alt="Sitemark's logo"
                />
              </Button>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexGrow: 1,
                height: 150,
              }}
            >
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: '100%',
                  height: 40,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ':first-child': { pl: 0 },
                      ':last-child': { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: 'flex', md: 'none' },
              width: '100%',
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                ':last-child': { pb: 2 },
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">
                  ${totalPrice}
                </Typography>
              </div>
              <InfoMobile totalPrice={totalPrice} />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: 'flex', md: 'none' } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ':first-child': { pl: 0 },
                    ':last-child': { pr: 0 },
                    '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                <Typography variant="body1" color="text.secondary">
                  Your order number is
                  <strong>&nbsp;#140396</strong>. We have emailed your order
                  confirmation and will update you once its shipped.
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
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, district, setDistrict, orderId)}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    justifyContent: activeStep !== 0 ? 'space-between' : 'flex-end',
                    alignItems: 'end',
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: '60px',
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        display: { xs: 'none', sm: 'flex' },
                      }}
                    >
                      Về trước
                    </Button>
                  )}

                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{
                        display: { xs: 'flex', sm: 'none' },
                      }}
                    >
                      Về trước
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                    sx={{
                      width: { xs: '100%', sm: 'fit-content' },
                    }}
                  >
                    {activeStep === steps.length - 1 ? 'Thanh toán' : 'Tiếp'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
