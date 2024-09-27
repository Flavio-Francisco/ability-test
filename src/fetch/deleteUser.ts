import axios from "axios";

export async function deleteUser(token: string,id:number) {
    try {
      const response = await axios.delete('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`, 
          },
          data: {
              id:id
          }
      });
  
      return response.data;
    } catch (error) {
      console.log(error);
     return {message:"Erro ao deletar usuário"}
  
    }
  }