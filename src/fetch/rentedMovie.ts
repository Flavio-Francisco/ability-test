
import axios from "axios";

export interface Rented{
    id: number;
    rented: boolean;
    userId: number;
}

export async function rentedMovie(data:Rented, token: string) {
  try {

    const response = await axios.patch(
      "/api/rented", 
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
      
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Erro ao atualizar filmes:", error);
    throw error; 
  }
}
