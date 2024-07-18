import React from 'react';
import { Grid, List, ListItem, ListItemText, Collapse, styled } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useNavigate } from 'react-router-dom';


const categories = [
    {
        name: 'ORGANIC MILK',
        subcategories: [],
        icon: <OpacityIcon />,
        route: "/category/1"
    },
    {
        name: 'FLAVORED MILK',
        subcategories: [],
        icon: <OpacityIcon />,
        route: "/category/2"
    },
    {
        name: 'DAIRY ALTERNATIVES',
        subcategories: [],
        icon: <OpacityIcon />,
        route: "/category/3"
    },
];

const SidebarContainer = styled('div')(({ theme }) => ({
    width: '250px',
    backgroundColor: '#fff',
    borderRight: '1px solid #ddd',
    padding: '10px 0',
    height: '530px',
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
    const navigate = useNavigate();

    const handleClick = (category) => {
        navigate(category.route)
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <SidebarContainer>
                    <List component="nav">
                        {categories.map((category) => (
                            <div key={category.name}>
                                <CategoryItem button onClick={() => handleClick(category)}>
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
            <Grid item xs={9}>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="https://suabottot.com/wp-content/uploads/2024/05/suabottot-737x455.png" className="d-block w-100" alt="First slide" style={{ height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="https://suabottot.com/wp-content/uploads/elementor/thumbs/1-mua-sua-tang-qua-sua-bot-tot-ot73bz13tll6szo8mf1eljrgyrfod5b6yutnlhx0hq.png" className="d-block w-100" alt="Second slide" style={{ height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="carousel-item">
                            <img src="https://via.placeholder.com/737x455.png" className="d-block w-100" alt="Third slide" style={{ height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </Grid>
        </Grid>
    );
}

export default CategorySidebar;
