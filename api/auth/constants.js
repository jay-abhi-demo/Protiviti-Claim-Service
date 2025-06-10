import bcrypt from "bcryptjs";
export const users = [
    { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 8) }
  ];
export const JWT_SECRET = 'your-secret-key';