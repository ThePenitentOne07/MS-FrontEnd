import { CssBaseline } from "@mui/material";
import {
    createTheme,
    ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";

const PRIMARY = {
    lighter: "#f9e8fa",  // very light pinkish lavender
    light: "#f6d2f4",    // light pinkish lavender
    main: "#f3c6f7",     // your chosen color
    dark: "#e0a8e3",     // a muted darker pink
    darker: "#cb8bcd",   // even more saturated and darker pink
    contrastText: "#FFF", // white remains for good contrast on darker shades
};

const SECONDARY = {
    lighter: "#D6E4FF",
    light: "#84A9FF",
    main: "#3366FF",
    dark: "#1939B7",
    darker: "#091A7A",
    contrastText: "#FFF",
};
const SUCCESS = {
    lighter: "#E9FCD4",
    light: "#AAF27F",
    main: "#54D62C",
    dark: "#229A16",
    darker: "#08660D",
    contrastText: "#FFF",
};

function ThemeProvider({ children }) {
    const themeOptions = {
        palette: {
            primary: PRIMARY,
            secondary: SECONDARY,
            success: SUCCESS,
        },
        shape: { borderRadius: 8 }, //8px
    };

    const theme = createTheme(themeOptions);

    return (
        <MUIThemeProvider theme={theme}>
            {<CssBaseline />}
            {/* <CssBaseline /> xoa defaul css cuar browser */}
            {children}
        </MUIThemeProvider>
    );
}

export default ThemeProvider;
