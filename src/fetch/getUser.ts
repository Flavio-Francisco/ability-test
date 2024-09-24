import axios from 'axios';

export async function fetchUsuarios(token: string) {
  try {
    const response = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,  // Enviando o token JWT no cabeçalho
      },
    });

    // Aqui você pode manipular a resposta recebida
    const usuarios = response.data;
    console.log('Usuários:', usuarios);

    return usuarios;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;  // Lançando o erro para tratamento posterior
  }
}
