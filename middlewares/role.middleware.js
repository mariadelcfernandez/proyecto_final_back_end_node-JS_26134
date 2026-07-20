import  db  from '../services/firebaseService.js';
import  getCollection  from '../services/localDB.service.js';

// Middleware para verificar roles, usando Firebase primero y fallback a local
const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const uid = req.user.uid;
      let userRole = null;

      // Intentar obtener desde Firebase
      try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
          userRole = userDoc.data().role;
        }
      } catch (firebaseError) {
        console.warn('Firebase falló al obtener rol, usando db.json');
        // Fallback a local
        const users = getCollection('users');
        const userLocal = users.find(u => u.uid === uid);
        if (userLocal) {
          userRole = userLocal.role;
        }
      }

      if (!userRole) {
        return res.status(403).json({ error: 'Usuario no encontrado' });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: 'Permisos insuficientes' });
      }

      req.userRole = userRole;
      next();
    } catch (error) {
      console.error('Error en middleware de roles:', error);
      return res.status(500).json({ error: 'Error interno' });
    }
  };
};

export default { checkRole};