import jwt from "jsonwebtoken";
import 'dotenv/config'; 
import logger from '../utils/logger.js';


export const authenticateToken = (req) => {
    const authHeader = req.headers["authorization"];
    console.log("Auth Header recebido:", authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        console.log("Token não encontrado no header.");
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decodificado com sucesso:", decoded);
        return decoded;
    } catch (error) {
        logger.warn(`Authentication failed: ${error.message}`);
        console.error("Erro na verificação do JWT:", error.message);
        return null;

    }
}

export const authorizeRole = (user, role) => {
    if (!user) {
        logger.warn("Access denied: Attempted restricted action without login.");
        throw new Error("Access denied: missing or invalid token.");
    }
    if (user.role !== role) {
        logger.warn(`Access forbidden: User ${user.id} tried to act as ${role}.`);
        throw new Error("Access forbidden: insufficient privileges.");
       
    }
}