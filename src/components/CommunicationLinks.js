// src/components/CommunicationLinks.js
import React from 'react';
import { IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';

const CircleButton = styled(IconButton)(({ theme }) => ({
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const CommunicationContainer = styled('div')(({ theme }) => ({
    position: 'fixed',
    bottom: 30,
    right: 16,
    transform: 'translateY(-50%)',
    zIndex: 1000,
}));

function CommunicationLinks() {
    return (
        <CommunicationContainer>
            <Stack spacing={2}>
                <CircleButton href="mailto:your-email@example.com">
                    <EmailIcon />
                </CircleButton>
                <CircleButton href="https://your-chat-platform.com">
                    <ChatIcon />
                </CircleButton>
                <CircleButton href="tel:+1234567890">
                    <PhoneIcon />
                </CircleButton>
            </Stack>
        </CommunicationContainer>
    );
}

export default CommunicationLinks;
