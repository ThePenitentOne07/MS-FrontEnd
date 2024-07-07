// StaffCard.js
import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import styled from '@emotion/styled';

const StaffCardContainer = styled(Card)`
  display: flex;
  align-items: center;
  background-color: #1976d2; /* pink color */
  color: white;
  margin-bottom: 16px;
`;

const StaffAvatar = styled(Avatar)`
  background-color: white;
  color: #1976d2;
  margin-right: 16px;
`;

function StaffCard({ staff, onClick }) {
    return (
      <StaffCardContainer onClick={() => onClick(staff)}>
        <StaffAvatar>{staff.name[0]}</StaffAvatar>
        <CardContent>
          <Typography variant="h6">
            {staff.name}
          </Typography>
        </CardContent>
      </StaffCardContainer>
    );
}

export default StaffCard;
