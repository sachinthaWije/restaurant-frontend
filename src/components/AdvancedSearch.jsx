import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CircularProgress,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    categoryName: "",
  });
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8090/category");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8090/api/search/menus",
        null,
        {
          params: {
            ...searchParams,
            page,
            size: 3,
          },
        }
      );
      console.log(response);
      setResults(response.data.contentDto);
      setPagination({
        currentPage: response.data.pageNumber,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      });
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
        py: 8,
      }}
    >
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Menu Search
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Menu Name"
              variant="outlined"
              value={searchParams.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryName"
                value={searchParams.categoryName}
                onChange={handleInputChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem
                    key={category.categoryId}
                    value={category.categoryName}
                  >
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="minPrice"
              label="Min Price"
              type="number"
              variant="outlined"
              value={searchParams.minPrice}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="maxPrice"
              label="Max Price"
              type="number"
              variant="outlined"
              value={searchParams.maxPrice}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={() => handleSearch(0)}
              disabled={loading}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {results.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            <List>
              {results.map((menu) => {
                const hasOffer = menu.offerName && menu.offerName.length > 0;
                const discountedPrice = hasOffer
                  ? menu.price * (1 - menu.discountPercentage / 100)
                  : menu.price;

                return (
                  <ListItem key={menu.menuId} divider>
                    <ListItemText
                      primary={
                        <>
                          {menu.name}
                          {hasOffer && (
                            <LocalOfferIcon
                              style={{ marginRight: 8, color: "#ff5722" }}
                            />
                          )}
                        </>
                      }
                      secondary={
                        <>
                          {hasOffer ? (
                            <>
                              <Typography
                                variant="body2"
                                component="span"
                                style={{
                                  textDecoration: "line-through",
                                  marginRight: 8,
                                }}
                              >
                                ${menu.price.toFixed(2)}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="span"
                                color="secondary"
                              >
                                ${discountedPrice.toFixed(2)}
                              </Typography>
                            </>
                          ) : (
                            `$${menu.price.toFixed(2)}`
                          )}
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage + 1}
                onChange={(_, page) => handleSearch(page - 1)}
                disabled={loading}
              />
            </Box>
            <Typography variant="body2" align="center" mt={1}>
              Total results: {pagination.totalElements}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdvancedSearch;
