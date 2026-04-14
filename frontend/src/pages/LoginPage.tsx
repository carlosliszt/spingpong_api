import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginAdmin } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/shared/store/authStore';

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(6)
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: ({ email, senha }: FormData) => loginAdmin(email, senha),
    onSuccess: ({ token, usuario }) => {
      setSession(token, usuario);
      navigate('/');
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form className="card w-full max-w-md space-y-4" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <h1 className="text-xl font-semibold">Login Admin</h1>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" className="input" {...register('email')} />
          {errors.email ? <p className="text-xs text-rose-600">{errors.email.message}</p> : null}
        </div>
        <div>
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" className="input" {...register('senha')} />
          {errors.senha ? <p className="text-xs text-rose-600">{errors.senha.message}</p> : null}
        </div>
        {mutation.isError ? <p className="text-sm text-rose-600">Falha no login. Verifique credenciais.</p> : null}
        <button className="btn-primary w-full" type="submit" disabled={mutation.isPending}>Entrar</button>
        <p className="text-center text-sm text-slate-600">
          Nao possui conta?{' '}
          <Link className="font-medium text-brand-700 hover:underline" to="/register">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
