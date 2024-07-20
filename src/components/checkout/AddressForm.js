import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import { useEffect } from 'react';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const districts = [
  'Quận 1',
  'Quận 2',
  'Quận 3',
  'Quận 4',
  'Quận 5',
  'Quận 6',
  'Quận 7',
  'Quận 8',
  'Quận 9',
  'Quận 10',
  'Quận 11',
  'Quận 12',
  'Quận Bình Tân',
  'Quận Bình Thạnh',
  'Quận Gò Vấp',
  'Quận Phú Nhuận',
  'Quận Tân Bình',
  'Quận Tân Phú',
  'Quận Thủ Đức',
  'Huyện Bình Chánh',
  'Huyện Cần Giờ',
  'Huyện Củ Chi',
  'Huyện Hóc Môn',
  'Huyện Nhà Bè',
];

export default function AddressForm({ district, setDistrict }) {
  const [fullName, setFullName] = React.useState('');
  const [fullNameError, setFullNameError] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [addressError, setAddressError] = React.useState(false);
  const [telNo, setTelNo] = React.useState('');
  const [telNoError, setTelNoError] = React.useState(false);

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleFullNameChange = (event) => {
    const value = event.target.value;
    setFullName(value);
    setFullNameError(value.trim() === '');
  };

  const handleAddressChange = (event) => {
    const value = event.target.value;
    setAddress(value);
    setAddressError(value.trim() === '');
  };

  const handleTelNoChange = (event) => {
    const value = event.target.value;
    setTelNo(value);
    setTelNoError(!/^\d{10,11}$/.test(value));
  };
  // useEffect(() => {
  //   isError(
  //     fullName.trim() === '' ||
  //     address.trim() === '' ||
  //     !/^\d{10,11}$/.test(telNo) ||
  //     district === ''
  //   );

  // }, [fullName, address, telNo, district, isError]);


  return (
    <Grid container spacing={3}>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="fullName" required>
          Họ và tên
        </FormLabel>
        <TextField
          id="fullName"
          name="fullName"
          type="text"
          value={fullName}
          onChange={handleFullNameChange}
          error={fullNameError}
          helperText={fullNameError ? 'Họ và tên không được để trống' : ''}
          autoComplete="family-name"
          required
          variant="outlined"
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address" required>
          Địa chỉ
        </FormLabel>
        <TextField
          id="address"
          name="address"
          type="text"
          value={address}
          onChange={handleAddressChange}
          error={addressError}
          helperText={addressError ? 'Địa chỉ không được để trống' : ''}
          autoComplete="shipping address-line1"
          required
          variant="outlined"
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="district" required>
          Quận
        </FormLabel>
        <FormControl variant="outlined" required>
          <Select
            id="district"
            name="district"
            type="text"
            value={district}
            onChange={handleDistrictChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Chọn Quận
            </MenuItem>
            {districts.map((district) => (
              <MenuItem key={district} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="telNo" required>
          Số điện thoại
        </FormLabel>
        <TextField
          id="telNo"
          name="telNo"
          type="text"
          value={telNo}
          onChange={handleTelNoChange}
          error={telNoError}
          helperText={telNoError ? 'Số điện thoại không hợp lệ' : ''}
          autoComplete="telNo"
          required
          variant="outlined"
        />
      </FormGrid>
    </Grid>
  );
}
