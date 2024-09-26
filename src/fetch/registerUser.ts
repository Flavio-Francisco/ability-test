import { User } from "@/types/user";
import axios from "axios";



export async function registerUser(userData: User, token: string) {
  try {
    const response = await axios.post(
      "/api/users", 
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; 
  } catch (error) {
 
   
      console.error("Erro ao cadastrar usuário:", error);
     
 
  }
}
