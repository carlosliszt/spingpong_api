import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerAdmin } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/shared/store/authStore';

const schema = z.object({
  nome: z.string().min(3, 'Nome deve ter no minimo 3 caracteres'),
  email: z.string().email('Email invalido'),
  senha: z.string().min(6, 'Senha deve ter no minimo 6 caracteres')
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: ({ nome, email, senha }: FormData) => registerAdmin(nome, email, senha),
    onSuccess: ({ token, usuario }) => {
      setSession(token, usuario);
      navigate('/');
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form className="card w-full max-w-md space-y-4" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <h1 className="text-xl font-semibold">Criar conta de admin</h1>
        <div>
          <label htmlFor="nome">Nome</label>
          <input id="nome" className="input" {...register('nome')} />
          {errors.nome ? <p className="text-xs text-rose-600">{errors.nome.message}</p> : null}
        </div>
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

        {mutation.isError ? <p className="text-sm text-rose-600">Falha no registro. Verifique os dados.</p> : null}

        <button className="btn-primary w-full" type="submit" disabled={mutation.isPending}>
          Registrar
        </button>

        <p className="text-center text-sm text-slate-600">
          Ja possui conta?{' '}
          <Link className="font-medium text-brand-700 hover:underline" to="/login">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}

