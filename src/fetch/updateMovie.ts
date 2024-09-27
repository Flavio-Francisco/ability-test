import { Movies } from "@/types/movies";
import axios from "axios";


export async function updateMovie(movie: Movies, token: string) {
  try {
    const formData = new FormData();

    // Adiciona os campos do filme ao FormData
    formData.append("id", movie.id.toString());
    formData.append("title", movie.title);
    formData.append("releaseYear", movie.releaseYear.toString());
    formData.append("overview", movie.overview);
    formData.append("price", movie.price.toString());
    formData.append("rented", movie.rented.toString());

    // Se houver um poster, adicione ao FormData
    if (movie.posterPath) {
      formData.append("poster", movie.posterPath); // 'poster' deve ser um File
    }

    const response = await axios.patch(
      "/api/movies", 
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          // O header 'Content-Type' será configurado automaticamente pelo axios
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Erro ao atualizar filmes:", error);
    throw error; // Lançar o erro novamente se você quiser tratá-lo mais adiante
  }
}

