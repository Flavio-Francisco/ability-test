export interface UserData {
    id: number;
    email: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
    name: string;
    cpf: string;
    birthDate: string; // Pode ser uma string ou Date, dependendo de como você deseja manipular
    phone: string;
  }
  