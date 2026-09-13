import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'data', 'components.json');

function readData() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data file:', err.message);
    return { components: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data file:', err.message);
    throw err;
  }
}

// GET all components
app.get('/api/components', (req, res) => {
  const data = readData();
  res.json(data.components);
});

// GET single component by id
app.get('/api/components/:id', (req, res) => {
  const data = readData();
  const comp = data.components.find((c) => c.id === req.params.id);
  if (!comp) {
    return res.status(404).json({ error: 'Component not found' });
  }
  res.json(comp);
});

// POST create new component
app.post('/api/components', (req, res) => {
  const data = readData();
  const { id, name, category, quantity, minStock, laboratory, status, manufacturer, dateAdded, description } = req.body;

  if (!id || !name || !category || quantity == null || minStock == null || !laboratory || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const exists = data.components.find((c) => c.id === id);
  if (exists) {
    return res.status(409).json({ error: 'Component ID already exists' });
  }

  const newComp = {
    id,
    name,
    category,
    quantity: Number(quantity),
    minStock: Number(minStock),
    laboratory,
    status,
    manufacturer: manufacturer || '',
    dateAdded: dateAdded || new Date().toISOString().split('T')[0],
    description: description || '',
  };

  data.components.push(newComp);
  writeData(data);
  res.status(201).json(newComp);
});

// PUT update component
app.put('/api/components/:id', (req, res) => {
  const data = readData();
  const idx = data.components.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Component not found' });
  }

  const { name, category, quantity, minStock, laboratory, status, manufacturer, dateAdded, description } = req.body;

  data.components[idx] = {
    ...data.components[idx],
    name: name !== undefined ? name : data.components[idx].name,
    category: category !== undefined ? category : data.components[idx].category,
    quantity: quantity !== undefined ? Number(quantity) : data.components[idx].quantity,
    minStock: minStock !== undefined ? Number(minStock) : data.components[idx].minStock,
    laboratory: laboratory !== undefined ? laboratory : data.components[idx].laboratory,
    status: status !== undefined ? status : data.components[idx].status,
    manufacturer: manufacturer !== undefined ? manufacturer : data.components[idx].manufacturer,
    dateAdded: dateAdded !== undefined ? dateAdded : data.components[idx].dateAdded,
    description: description !== undefined ? description : data.components[idx].description,
  };

  writeData(data);
  res.json(data.components[idx]);
});

// DELETE component
app.delete('/api/components/:id', (req, res) => {
  const data = readData();
  const idx = data.components.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Component not found' });
  }

  data.components.splice(idx, 1);
  writeData(data);
  res.json({ message: 'Component deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`ECE Lab Inventory backend running on http://localhost:${PORT}`);
});
