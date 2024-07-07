// // PrivateRoute.js
// import React, { useContext } from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { AuthContext } from './AuthContext';

// const PrivateRoute = ({ roles }) => {
//     const { isAuthenticated, user } = useContext(AuthContext);
//     const location = useLocation();

//     if (!isAuthenticated) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     if (roles && roles.indexOf(user.role) === -1) {
//         return <Navigate to="/" replace />;
//     }

//     return <Outlet />;
// };

// export default PrivateRoute;
