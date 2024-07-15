import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoutes = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role == "ADMIN") {
            setIsAdmin(true);
        }
    }, []); // Added an empty dependency array to ensure it only runs once
    console.log(isAdmin);
    return isAdmin ? <Outlet /> : <Navigate to="*" />;

}


export default AdminRoutes;
