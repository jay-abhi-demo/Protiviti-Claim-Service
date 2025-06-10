
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { JWT_SECRET, users } from "./constants.js";
export const handleLogin = ('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});