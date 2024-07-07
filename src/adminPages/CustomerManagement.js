import React, { useState } from 'react';
import { Container, Box, TextField, Typography, Button, Grid } from '@mui/material';
import CustomerCard from '../components/CustomerCard';
import CustomerDetailModal from '../components/CustomerDetailModal';

const initialCustomerList = [
  {
    id: 1,
    name: 'Customer 1',
    role: 'Regular',
    addedOn: '15/3/2023',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '(123) 456-7890',
    email: 'john.doe@example.com',
    address: '123 Main St',
    dateOfBirth: '1/1/1990',
  },
  // Add other customer details here...
];

function CustomerManagement() {
  const [customerList, setCustomerList] = useState(initialCustomerList);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCustomer = () => {
    const newCustomerName = `Customer ${customerList.length + 1}`;
    setCustomerList([...customerList, { name: newCustomerName, role: 'Regular' }]);
  };

  const handleCardClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
  };

  const filteredCustomerList = customerList.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Customers</Typography>
        
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search customers"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        {filteredCustomerList.map(customer => (
          <Grid item xs={12} key={customer.name}>
            <CustomerCard customer={customer} onClick={handleCardClick} />
          </Grid>
        ))}
      </Grid>
      <CustomerDetailModal open={!!selectedCustomer} handleClose={handleCloseModal} customer={selectedCustomer} />
    </Container>
  );
}

export default CustomerManagement;
