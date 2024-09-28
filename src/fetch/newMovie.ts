import { Movies } from "@/types/movies";
import axios from "axios";


export async function newMovie(movie: Movies, token: string) {
  try {
    const formData = new FormData();

  
    formData.append("title", movie.title);
    formData.append("releaseYear", movie.releaseYear.toString());
    formData.append("overview", movie.overview);
    formData.append("price", movie.price.toString());
    formData.append("rented", movie.rented.toString());

 
    if (movie.posterPath) {
      formData.append("poster", movie.posterPath); 
    }

    const response = await axios.post(
      "/api/movies", 
      formData,
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

