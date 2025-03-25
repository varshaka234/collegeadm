import connection from '../config/db.js';

export const createUser = (name, email, password, role, callback) => {
  connection.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role],
    callback
  );
};

export const getUserByEmail = (email, callback) => {
  connection.query('SELECT * FROM users WHERE email = ?', [email], callback);
};
