import React from 'react';
import { List, ListItem, ListItemText, Collapse, styled } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const categories = [
    {
        name: 'Sữa bột',
        subcategories: ['Subcategory 1.1', 'Subcategory 1.2'],
    },
    {
        name: 'Sữa pha sẵn',
        subcategories: ['Subcategory 2.1', 'Subcategory 2.2'],
    },
    
];

function CategorySidebar() {
    const [open, setOpen] = React.useState({});
    const SidebardContainer = styled('div')(({ theme }) => ({
        position: 'fixed',
        width: '15%',
        zIndex: 1100,
      }));

    const handleClick = (category) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [category]: !prevOpen[category],
        }));
    };

    return (
        <SidebardContainer>
        <List component="nav" >
            {categories.map((category) => (
                <div key={category.name}>
                    <ListItem button onClick={() => handleClick(category.name)}>
                        <ListItemText primary={category.name} />
                        {open[category.name] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open[category.name]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {category.subcategories.map((subcategory) => (
                                <ListItem key={subcategory} button sx={{ pl: 4 }}>
                                    <ListItemText primary={subcategory} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </div>
            ))}
        </List>
        </SidebardContainer>
    );
}

export default CategorySidebar;
// import React, { useState } from 'react';
// import { List, ListItem, ListItemText } from '@mui/material';

// const categories = [
//     {
//         name: 'Category 1',
//         subcategories: ['Subcategory 1.1', 'Subcategory 1.2'],
//     },
//     {
//         name: 'Category 2',
//         subcategories: ['Subcategory 2.1', 'Subcategory 2.2'],
//     },
//     {
//         name: 'Category 3',
//         subcategories: ['Subcategory 3.1', 'Subcategory 3.2'],
//     },
//     {
//         name: 'Category 4',
//         subcategories: ['Subcategory 4.1', 'Subcategory 4.2'],
//     },
// ];

// function CategorySidebar() {
//     const [selectedCategory, setSelectedCategory] = useState(null);

//     const handleCategoryClick = (category) => {
//         setSelectedCategory((prevCategory) =>
//             prevCategory === category ? null : category
//         );
//     };

//     return (
//         <div style={{ display: 'flex' }}>
//             <List component="nav" style={{ width: '200px', border: '1px solid #ccc' }}>
//                 {categories.map((category) => (
//                     <ListItem
//                         button
//                         key={category.name}
//                         selected={selectedCategory === category.name}
//                         onClick={() => handleCategoryClick(category.name)}
//                         sx={{
//                             border: '1px solid #ccc',
//                             margin: '4px 0',
//                             borderRadius: '4px',
//                         }}
//                     >
//                         <ListItemText primary={category.name} />
//                     </ListItem>
//                 ))}
//             </List>
//             {selectedCategory && (
//                 <List component="nav" style={{ width: '200px', marginLeft: '16px', border: '1px solid #ccc' }}>
//                     {categories
//                         .find((category) => category.name === selectedCategory)
//                         .subcategories.map((subcategory) => (
//                             <ListItem
//                                 button
//                                 key={subcategory}
//                                 sx={{
//                                     // border: '1px solid #ccc',
//                                     margin: '4px 0',
//                                     borderRadius: '4px',
//                                 }}
//                             >
//                                 <ListItemText primary={subcategory} />
//                             </ListItem>
//                         ))}
//                 </List>
//             )}
//         </div>
//     );
// }

// export default CategorySidebar;


