import axios from 'axios';

export async function fetchUsuarios(token: string) {
  try {
    const response = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });

  
    const usuarios = response.data;
    console.log('Usuários:', usuarios);

    return usuarios;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;  
  }
}
