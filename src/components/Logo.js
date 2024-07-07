import { Link as RouterLink } from "react-router-dom";
import { Box } from "@mui/material";
import logoImg from "../Logo.png";

function Logo({ disabledLink = false, sx }) {
    const Logo = (
        <Box sx={{ width: 70, height: 70, ...sx }}>
            <img src={logoImg} alt="logo" width="100%" />
        </Box>
    );

    if (disabledLink) {
        return <>{Logo}</>;
    }

    return <RouterLink to="/">{Logo}</RouterLink>;
}

export default Logo;
