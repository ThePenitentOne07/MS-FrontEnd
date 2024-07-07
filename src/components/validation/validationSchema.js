// validationSchema.js
import * as yup from 'yup'
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const Schema = yup.object().shape({
  quantity: yup
    .number()
    .typeError('Số lượng phải là số')
    .required('Số lượng không được để trống')
    .min(0, 'Số lượng không được âm')
    .max(1000, 'Số lượng không được vượt quá 1000')
    .integer('Số lượng phải là số nguyên'),
  name: yup
    .string()
    .matches(/^[A-Za-zÀ-ÖÙ-öù-ÿĀ-žḀ-ỿăươ  ]*$/, 'Tên không hợp lệ')
    .max(40, 'Tên không được quá 40 ký tự')
    .required('Tên không được để trống'),
  productName: yup
    .string()
    .required('Tên sản phẩm không được để trống'),
  price: yup
    .number()
    .typeError('Giá phải là số')
    .required('Giá không được để trống')
    .min(0, 'Giá không được dưới không'),
  phoneNumber: yup.string().required('Số điện thoại không được để trống').matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
  email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  password: yup.string().required('Mật khẩu không được để trống'),
  createPassword: yup.string().required('Mật khẩu không được để trống'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('createPassword'), null], 'Mật khẩu không khớp')
    .required('Mật khẩu không được để trống'),
});
