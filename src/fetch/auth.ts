
import axios from 'axios';


export async function auth(email: string,password: string){
  try {
   const data =   await axios.post('/api/auth', {
          email,
          password,
  
      }).then(response => {
         
         
    
          return response;
      }).catch(err => { 
          return err
      })
      console.log("User: " ,data);
  return data
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;  
  }
}