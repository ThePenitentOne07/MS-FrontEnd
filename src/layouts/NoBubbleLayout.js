import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";
import CommunicationLinks from "../components/CommunicationLinks";
function NoBubbleLayout() {
    return (
        <Stack sx={{ minHeight: "100vh" }}>
            <MainHeader />

            <Outlet />

            <Box sx={{ flexGrow: 1 }} />


            <MainFooter />
            
        </Stack>
    );
}

export default NoBubbleLayout;