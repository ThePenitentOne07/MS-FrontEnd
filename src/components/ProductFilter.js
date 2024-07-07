import { Box, Button, Stack, Typography } from "@mui/material";
import FMultiCheckbox from "./form/FMultiCheckbox";
import FRadioGroup from "./form/FRadioGroup";
import ClearAllIcon from "@mui/icons-material/ClearAll";

export const SORT_BY_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "priceDesc", label: "Price: High-Low" },
  { value: "priceAsc", label: "Price: Low-High" },
];

export const FILTER_GENDER_OPTIONS = [ "Mẹ", "Bé"];

export const FILTER_CATEGORY_OPTIONS = [
  "All",
  "Baby Nutrion",
  "Apparel",
  "Accessories",
];

export const FILTER_PRICE_OPTIONS = [
  { value: "below", label: "Dưới 25" },
  { value: "between", label: "Từ 25 -75" },
  { value: "above", label: "Trên 75" },
];

function ProductFilter({ resetFilter }) {
  return (
    <Stack spacing={2} sx={{ p: 3, width: 250 , mt: 10}}>
      <Stack spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Dành cho
        </Typography>
        <FMultiCheckbox
          name="gender"
          options={FILTER_GENDER_OPTIONS}
          sx={{ width: 1 }}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Price
        </Typography>
        <FRadioGroup
          name="priceRange"
          options={FILTER_PRICE_OPTIONS.map((item) => item.value)}
          getOptionLabel={FILTER_PRICE_OPTIONS.map((item) => item.label)}
        />
      </Stack>

      

     

      <Box>
        <Button
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          onClick={resetFilter}
          startIcon={<ClearAllIcon />}
        >
          Xóa bộ lọc
        </Button>
      </Box>
    </Stack>
  );
}

export default ProductFilter;