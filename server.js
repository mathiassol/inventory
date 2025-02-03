const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database'); // Import the database connection

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Get all products
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, image, stock } = req.body;
  if (!name || !image || typeof stock !== 'number') {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  db.run(
    'INSERT INTO products (name, image, stock) VALUES (?, ?, ?)',
    [name, image, stock],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, name, image, stock });
      }
    }
  );
});

// Update stock for a product
app.put('/products/:id', (req, res) => {
  const { stock } = req.body;
  const { id } = req.params;

  if (typeof stock !== 'number') {
    return res.status(400).json({ error: 'Invalid stock value' });
  }

  db.run(
    'UPDATE products SET stock = ? WHERE id = ?',
    [stock, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json({ message: 'Stock updated successfully' });
      }
    }
  );
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ message: 'Product deleted successfully' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});