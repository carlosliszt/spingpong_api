import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerAdmin } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/shared/store/authStore';
import { Card, Section, Input, Button, Alert } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

interface FormData {
  nome: string;
  email: string;
  senha: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const { feedback, showError, clear } = useFeedback();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      nome: '',
      email: '',
      senha: ''
    }
  });

  const mutation = useMutation({
    mutationFn: ({ nome, email, senha }: FormData) => registerAdmin(nome, email, senha),
    onSuccess: ({ token, usuario }) => {
      setSession(token, usuario);
      navigate('/');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Erro ao registrar');
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log('Form submitted with data:', data);

      // Validação manual
      if (!data.nome) {
        showError('Nome é obrigatório');
        return;
      }
      if (data.nome.length < 3) {
        showError('Nome deve ter no mínimo 3 caracteres');
        return;
      }
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
      showError('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <Section title="✨ Criar Conta" subtitle="Registre-se como administrador">
            {feedback && (
              <Alert type="danger" onClose={clear}>
                {feedback.msg}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nome *"
                placeholder="Ex: João Silva"
                {...register('nome', { required: true })}
              />

              <Input
                label="Email *"
                type="email"
                placeholder="seu@email.com"
                {...register('email', { required: true })}
              />

              <Input
                label="Senha *"
                type="password"
                placeholder="••••••••"
                help="Mínimo 6 caracteres"
                {...register('senha', { required: true })}
              />

              <Button variant="primary" isBlock isLoading={mutation.isPending || isSubmitting} type="submit">
                Registrar
              </Button>

              <div className="text-center text-sm text-neutral-600">
                Já possui conta?{' '}
                <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
                  Entrar aqui
                </Link>
              </div>
            </form>
          </Section>
        </Card>
      </div>
    </div>
  );
}

