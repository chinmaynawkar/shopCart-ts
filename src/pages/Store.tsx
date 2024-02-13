import { 
  Container,
   Grid, 
   Typography,
    TextField,
     Box,
      Select, 
      FormControl,
       InputLabel, 
       MenuItem,
      CircularProgress } from "@mui/material";
import { StoreItem } from "../components/StoreItem";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useEffect, useState } from "react";


const categories = [
  "All",
  "men's clothing",
  "jewelery",
  "electronics",
  "women's clothing"
  
];

export function Store() {
  const { products, searchTerm, setSearchTerm } = useShoppingCart();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter products based on the search term
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(term.toLowerCase()) &&
        (!selectedCategory ||
          product.category
            .toLowerCase()
            .includes(selectedCategory.toLowerCase()))
    );

    setFilteredProducts(filtered);
  };
  // Filter products based on the selected category
  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((product) =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  return (
    <Container sx={{ py:   4 }}>
      <Typography variant="h1" gutterBottom>
        Store
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb:   2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          sx={{
            maxWidth:   300,
            borderRadius:   1,
            backgroundColor: 'rgba(255,  255,  255,  0.15)',
            '&:hover': {
              backgroundColor: 'rgba(255,  255,  255,  0.25)',
            },
            transition: 'background-color  0.3s',
          }}
          onChange={handleSearch}
        />
        <FormControl variant="outlined" sx={{ minWidth:   120, ml:   2 }}>
          <InputLabel htmlFor="category-select">Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            label="Category"
            inputProps={{
              name: 'category',
              id: 'category-select',
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.length >   0 ? (
          filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} sx={{
              transition: 'transform  0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}>
              <StoreItem
                id={product.id}
                name={product.title}
                price={product.price}
                imgUrl={product.image}
              />
            </Grid>
          ))
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Container>
  );
}
