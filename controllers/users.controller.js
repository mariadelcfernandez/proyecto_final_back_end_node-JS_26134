import getCollection from '../services/localDB.service.js';
import getDocument from '../services/localDB.service.js';
import updateDocument from '../services/localDB.service.js';
// Listar todos los usuarios (admin)
const getUsers = async (req, res) => {
  try {
    const users = await getCollection('users');
    // No devolver datos sensibles (solo uid, email, displayName, role)
    const sanitized = users.map(u => ({
      uid: u.uid,
      email: u.email,
      name: u.displayName,
      role: u.role,
     // createdAt: u.createdAt,
    }));
    res.json(sanitized);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

// Cambiar rol de usuario (admin)
const updateUserRole = async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;
    const allowedRoles = ['cliente', 'vendedor', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    const updated = await updateDocument('users', uid, { role });
    if (!updated) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

export default { getUsers, updateUserRole };