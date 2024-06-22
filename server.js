const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE5MDM4MzkyLCJpYXQiOjE3MTkwMzgwOTIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjljYTk3Mjg0LTBiMDYtNDJjMy1iOTViLWNhMjhiNzI3ZTRiNCIsInN1YiI6IjI0NTEyMTczMzAxNUBtdnNyZWMuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI5Y2E5NzI4NC0wYjA2LTQyYzMtYjk1Yi1jYTI4YjcyN2U0YjQiLCJjbGllbnRTZWNyZXQiOiJyaVZlSnRCdU95R3dUbnVTIiwib3duZXJOYW1lIjoiSmFkaGF2IEF2aW5hc2giLCJvd25lckVtYWlsIjoiMjQ1MTIxNzMzMDE1QG12c3JlYy5lZHUuaW4iLCJyb2xsTm8iOiIyNDUxLTIxLTczMy0wMTUifQ.O6I58z-Y-sHoQqBJrfxa2TjuTc6LcYh95JN7n_DPqxc';
const BASE_URL = 'http://20.244.56.144/test';

// Middleware to parse JSON
app.use(express.json());

// Example route to test server
app.get('/', (req, res) => {
  res.send('Top Products HTTP Microservice');
});

// Function to fetch products from a specific company's API
const fetchProducts = async (company, category, minPrice = 0, maxPrice = 10000) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/companies/${company}/categories/${category}/products`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        params: {
          minPrice,
          maxPrice,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching products from ${company}: ${error.message}`);
    throw new Error(`Failed to fetch products from ${company}`);
  }
};

// Function to sort products based on a field and order
const sortProducts = (products, sortField = 'rating', sortOrder = 'desc') => {
  return products.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortField] - b[sortField];
    } else {
      return b[sortField] - a[sortField];
    }
  });
};

// GET Endpoint to fetch top N products within a category
app.get('/categories/:category/products', async (req, res) => {
  const { category } = req.params;
  let { n = 10, page = 1, minPrice = 0, maxPrice = 10000, sort = 'rating', order = 'desc' } = req.query;

  n = parseInt(n);
  page = parseInt(page);
  minPrice = parseFloat(minPrice);
  maxPrice = parseFloat(maxPrice);

  const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
  let allProducts = [];

  try {
    // Fetch products from all companies asynchronously
    const fetchPromises = companies.map(company => fetchProducts(company, category, minPrice, maxPrice));
    const results = await Promise.all(fetchPromises);

    // Flatten the array of arrays into a single array of products
    allProducts = results.flat();
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }

  // Sort products based on the requested sort field and order
  allProducts = sortProducts(allProducts, sort, order);

  // Paginate products
  const startIndex = (page - 1) * n;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + n).map(product => ({
    ...product,
    id: uuidv4(), // Generate a unique ID for each product
  }));

  res.json(paginatedProducts);
});

// GET Endpoint to fetch details of a specific product by ID
app.get('/categories/:category/products/:productId', async (req, res) => {
  const { category, productId } = req.params;
  let productDetails = null;

  try {
    // Fetch products from all companies asynchronously
    const fetchPromises = companies.map(company => fetchProducts(company, category));
    const results = await Promise.all(fetchPromises);

    // Flatten the array of arrays into a single array of products
    const allProducts = results.flat();

    // Find the product by ID
    productDetails = allProducts.find(product => product.id === productId);

    if (!productDetails) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Generate a unique ID for the product detail
    productDetails.id = uuidv4();
    
    res.json(productDetails);
  } catch (error) {
    console.error(`Error fetching product details: ${error.message}`);
    return res.status(500).json({ message: 'Failed to fetch product details' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
