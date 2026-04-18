import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginAdmin } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/shared/store/authStore';
import { Button, Card, Input, Alert } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

interface FormData {
  email: string;
  senha: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const { feedback, showError, clear } = useFeedback();
  
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      senha: ''
    }
  });

  const mutation = useMutation({
    mutationFn: ({ email, senha }: FormData) => loginAdmin(email, senha),
    onSuccess: ({ token, usuario }) => {
      setSession(token, usuario);
      navigate('/');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Email ou senha inválidos');
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log('Form submitted with data:', data); // Debug

      // Validação manual
      if (!data.email) {
        showError('Email é obrigatório');
        return;
      }
      if (!data.email.includes('@')) {
        showError('Email inválido');
        return;
      }
      if (!data.senha) {
        showError('Senha é obrigatória');
        return;
      }
      if (data.senha.length < 6) {
        showError('Senha deve ter no mínimo 6 caracteres');
        return;
      }

      console.log('Validação passou, enviando...');
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error('Erro no submit:', error);
      showError('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <Card size="lg" className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="heading-page text-3xl">🏓 SpingPong</h1>
          <p className="text-neutral-600 mt-1">Gerenciamento de Torneios de Tênis de Mesa</p>
        </div>

        {feedback && (
          <Alert type="danger" onClose={clear} className="mb-4">
            {feedback.msg}
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email *"
            type="email"
            placeholder="admin@example.com"
            autoComplete="email"
            {...register('email')}
          />

          <Input
            label="Senha *"
            type="password"
            placeholder="Sua senha"
            autoComplete="current-password"
            {...register('senha')}
          />

          <Button
            variant="primary"
            isBlock
            isLoading={mutation.isPending || isSubmitting}
            type="submit"
            onClick={(e) => {
              console.log('Button clicked'); // Debug
            }}
          >
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-600 mt-4">
          Não possui conta?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700 transition-colors">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  );
}
