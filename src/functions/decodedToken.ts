import { NextRequest} from "next/server";
import jwt from 'jsonwebtoken';
import { DecodedToken } from "@/types/DecodedToken";



   


export function decodedToken(data: NextRequest): DecodedToken {
     const authHeader = data.headers.get('authorization');
    
    if (!authHeader) {
      throw new Error('Token não fornecido');
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Token inválido');
    }
  
    try {
      // Decodifica o token
      return jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    } catch  {
      throw new Error('Token inválido ou expirado');
    }
  }
 
 
  
  
  
 