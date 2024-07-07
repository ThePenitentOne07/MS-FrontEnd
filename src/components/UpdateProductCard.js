// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, DialogContentText } from '@mui/material';

// function UpdateProductCard({ open, onClose, product }) {
//   const [name, setName] = useState('');
//   const [quantity, setQuantity] = useState(0);
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState(0);

//   const [nameError, setNameError] = useState('');
//   const [quantityError, setQuantityError] = useState('');
//   const [descriptionError, setDescriptionError] = useState('');
//   const [priceError, setPriceError] = useState('');

//   useEffect(() => {
//     if (product) {
//       setName(product.name);
//       setQuantity(product.quantity);
//       setDescription(product.description);
//       setPrice(product.price);
//     }
//   }, [product]);

//   const validateName = (name) => {
//     const regex = /^[a-zA-Z0-9\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]+$/u;
//     if (!regex.test(name)) {
//       setNameError('Name can only contain letters, numbers, spaces, and Vietnamese characters');
//       return false;
//     }
//     setNameError('');
//     return true;
//   };

//   const validateQuantity = (quantity) => {
//     if (quantity < 0) {
//       setQuantityError('Quantity cannot be negative');
//       return false;
//     }
//     setQuantityError('');
//     return true;
//   };

//   const validateDescription = (description) => {
//     if (description.length < 5) {
//       setDescriptionError('Description must be at least 5 characters long');
//       return false;
//     }
//     setDescriptionError('');
//     return true;
//   };

//   const validatePrice = (price) => {
//     if (price <= 0) {
//       setPriceError('Price must be greater than 0');
//       return false;
//     }
//     setPriceError('');
//     return true;
//   };

//   const handleNameChange = (event) => {
//     setName(event.target.value);
//     validateName(event.target.value);
//   };

//   const handleQuantityChange = (event) => {
//     setQuantity(event.target.value);
//     validateQuantity(event.target.value);
//   };

//   const handleDescriptionChange = (event) => {
//     setDescription(event.target.value);
//     validateDescription(event.target.value);
//   };

//   const handlePriceChange = (event) => {
//     setPrice(event.target.value);
//     validatePrice(event.target.value);
//   };

//   const handleSubmit = () => {
//     const isNameValid = validateName(name);
//     const isQuantityValid = validateQuantity(quantity);
//     const isDescriptionValid = validateDescription(description);
//     const isPriceValid = validatePrice(price);

//     if (isNameValid && isQuantityValid && isDescriptionValid && isPriceValid) {
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Update Product</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Update the details of the product below.
//         </DialogContentText>
//         <TextField
//           margin="dense"
//           label="Name"
//           type="text"
//           fullWidth
//           value={name}
//           onChange={handleNameChange}
//           error={!!nameError}
//           helperText={nameError}
//         />
//         <TextField
//           margin="dense"
//           label="Quantity"
//           type="number"
//           fullWidth
//           value={quantity}
//           onChange={handleQuantityChange}
//           error={!!quantityError}
//           helperText={quantityError}
//         />
//         <TextField
//           margin="dense"
//           label="Description"
//           type="text"
//           fullWidth
//           value={description}
//           onChange={handleDescriptionChange}
//           error={!!descriptionError}
//           helperText={descriptionError}
//         />
//         <TextField
//           margin="dense"
//           label="Price"
//           type="number"
//           fullWidth
//           value={price}
//           onChange={handlePriceChange}
//           error={!!priceError}
//           helperText={priceError}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} disabled={!!nameError || !!quantityError || !!descriptionError || !!priceError}>
//           Update
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default UpdateProductCard;
