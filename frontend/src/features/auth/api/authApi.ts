import { http } from '@/shared/api/http';
import type { AdminUser } from '@/shared/types/domain';

type AuthResponse = {
  success: boolean;
  data: {
    token: string;
    usuario: AdminUser;
  };
};

export async function loginAdmin(email: string, senha: string) {
  const { data } = await http.post<AuthResponse>('/auth/login', { email, senha });
  return data.data;
}

export async function registerAdmin(nome: string, email: string, senha: string) {
  const { data } = await http.post<AuthResponse>('/auth/register', { nome, email, senha });
  return data.data;
}
