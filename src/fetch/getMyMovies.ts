import axios from 'axios';

export async function getMyMovies(token: string) {
  try {
    const response = await axios.get('/api/rented', {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });

  
    const users = response.data;
    console.log('Filmes:', users);

    return users;
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    throw error;  
  }
}
