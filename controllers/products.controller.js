import  updateDocument  from '../services/localDB.service.js';
import getCollection  from '../services/localDB.service.js';
import   deleteDocument  from '../services/firebaseService.js';
import  addDocument  from '../services/firebaseService.js';
import writeLocalDB  from '../services/localDB.service.js';
import readLocalDB from '../services/localDB.service.js';
import getDocument from '../services/firebaseService.js';
import db from '../services/firebaseService.js';
//const fetch = require('node-fetch'); // necesitarás instalar node-fetch: npm install node-fetch
/*import fetch from "node-fetch";
 const products = [ 
    { 
        id: 1, 
        name: 'Producto 1', 
        price: 1000 
    }, 
    { 
        id: 2, 
        name: 'Producto 2', 
        price: 2000 
    } 
  ] */
// Obtener todos los productos (público)
const getProducts = async (req, res) => {
  try {
    let products = await getCollection('products');
    // Si no hay productos en la base, hacemos seed desde fakestoreapi
    if (products.length === 0) {
      console.log('Cargando productos desde fakestoreapi...');
      const response = await fetch('https://fakestoreapi.com/products');
      const apiProducts = await response.json();
      // Transformar para que coincida con nuestro modelo
      for (const p of apiProducts) {
        // Guardamos cada producto, usando el id de la API como string o generamos uno
        await addDocument('products', {
          name: p.title,
          description: p.description,
          price: p.price,
          categories: p.categories,
          //image: p.image,
          inStock: true,
          brand: p.brand,
          count: 0,
         // rating: p.rating,
         // createdAt: new Date().toISOString(),
        }, p.id.toString()); // usamos el id de la API como string
      }
      products = await getCollection('products');
    }
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getDocument('products', id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Crear producto (solo vendedor o admin) - validación de roles en middleware
const createProduct = async (req, res) => {
  try {
    const { name, description, price, categories, inStock,  brand , count } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Título y precio son requeridos' });
    }
    const newProduct = {
      name,
      description: description || '',
      price,
      categories: categories || 'general',
      //image: image || '',
      inStock: inStock !== undefined ? inStock : false,
      brand: brand || '',
      count: count !== undefined ? count : 0,
      
      //rating: { rate: 0, count: 0 },
     // createdAt: new Date().toISOString(),
     // sellerId: req.user.uid, // quién creó el producto (vendedor)
    };
    const result = await addDocument('products', newProduct);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Editar producto (solo admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // No permitir actualizar campos sensibles como createdAt, sellerId
    delete updates.createdAt;
    delete updates.sellerId;
    const updated = await updateDocument('products', id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto (solo admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDocument('products', id);
    if (!result) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
export default  { getProducts, getProductById, createProduct, updateProduct, deleteProduct };