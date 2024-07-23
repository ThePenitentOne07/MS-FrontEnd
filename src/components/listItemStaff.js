import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
// import LayersIcon from '@mui/icons-material/Layers';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
// import AssignmentIcon from '@mui/icons-material/Assignment';
import { NavLink } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ViewListIcon from '@mui/icons-material/ViewList';
import SendIcon from '@mui/icons-material/Send';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={NavLink} to="/staff/product" activeClassName="active">
      <ListItemIcon>
        <Inventory2Icon />
      </ListItemIcon>
      <ListItemText primary="Product" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/staff/category" activeClassName="active">
      <ListItemIcon>
        <DynamicFeedIcon />
      </ListItemIcon>
      <ListItemText primary="Category" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/staff/voucher" activeClassName="active">
      <ListItemIcon>
        <MonetizationOnIcon />
      </ListItemIcon>
      <ListItemText primary="Voucher" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/staff/order" activeClassName="active">
      <ListItemIcon>
        <ViewListIcon />
      </ListItemIcon>
      <ListItemText primary="Order" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/staff/customer" activeClassName="active">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customer" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/staff/refundReq" activeClassName="active">
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Refund request" />
    </ListItemButton>


  </React.Fragment>
);

// export const secondaryListItems = (
//   <React.Fragment>
//     <ListSubheader component="div" inset>
//       Saved reports
//     </ListSubheader>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItemButton>
//   </React.Fragment>
// );
