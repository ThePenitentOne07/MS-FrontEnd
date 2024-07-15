import React from 'react';
import { Grid, List, ListItem, ListItemText, Collapse, styled } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import OpacityIcon from '@mui/icons-material/Opacity';

const categories = [
    {
        name: 'DANH MỤC SỮA BỘT',
        subcategories: [],
        icon: <OpacityIcon />,
    },
    {
        name: 'SỮA TĂNG CÂN CHO BÉ',
        subcategories: [],
        icon: <OpacityIcon />,
    },
    {
        name: 'SỮA TƯƠI NHẬP KHẨU',
        subcategories: [],
        icon: <OpacityIcon />,
    },
];

const SidebarContainer = styled('div')(({ theme }) => ({
    width: '250px',
    backgroundColor: '#fff',
    borderRight: '1px solid #ddd',
    padding: '10px 0',
    height: '300px',
    marginTop: '10px',
}));

const CategoryItem = styled(ListItem)(({ theme }) => ({
    padding: '10px 20px',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
}));

const CategoryIcon = styled('div')(({ theme }) => ({
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

function CategorySidebar() {
    const [open, setOpen] = React.useState({});

    const handleClick = (category) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [category]: !prevOpen[category],
        }));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <SidebarContainer>
                    <List component="nav">
                        {categories.map((category) => (
                            <div key={category.name}>
                                <CategoryItem button onClick={() => handleClick(category.name)}>
                                    <CategoryIcon>{category.icon}</CategoryIcon>
                                    <ListItemText primary={category.name} />
                                    {category.subcategories.length > 0 && (open[category.name] ? <ExpandLess /> : <ExpandMore />)}
                                </CategoryItem>
                                {category.subcategories.length > 0 && (
                                    <Collapse in={open[category.name]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {category.subcategories.map((subcategory) => (
                                                <ListItem key={subcategory} button sx={{ pl: 4 }}>
                                                    <ListItemText primary={subcategory} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </div>
                        ))}
                    </List>
                </SidebarContainer>
            </Grid>
            <Grid item xs={9} >
                <img src="https://suabottot.com/wp-content/uploads/2024/05/suabottot-737x455.png" alt="Sidebar Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Grid>
        </Grid>
    );
}

export default CategorySidebar;
