import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";
import CommunicationLinks from "../components/CommunicationLinks";
import AlertMsg from "../components/AlertMsg";

function MainLayout() {
    return (
        <Stack sx={{ minHeight: "100vh" }}>
            <MainHeader />
            <AlertMsg />
            <Box sx={{ mt: 10, flexGrow: 1 }}>
                <Outlet />
            </Box>
            <MainFooter />
            <CommunicationLinks />
        </Stack>
    );
}

export default MainLayout;
