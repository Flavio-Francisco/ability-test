import axios from 'axios';

export async function getUsers(token: string) {
  try {
    const response = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });

  
    const users = response.data;
    console.log('Usuários:', users);

    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;  
  }
}
