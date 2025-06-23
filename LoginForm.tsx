import React from 'react';
import { Music, Lock, Mail } from 'lucide-react';
import { useApp } from './AppContext';
import { useForm } from 'react-hook-form';
import { Button } from './Button';

interface LoginFields {
  email: string;
  password: string;
}

export function LoginForm() {
  const { state, dispatch } = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();
  const [error, setError] = React.useState('');

  const onSubmit = (data: LoginFields) => {
    const user = state.users.find(u => u.email === data.email);
    if (user && data.password) {
      dispatch({ type: 'LOGIN', payload: user });
      setError('');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-2">CalZik</h1>
          <p className="text-gray-600">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="votre@email.fr"
                {...register('email', { required: true })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="••••••••"
                {...register('password', { required: true })}
              />
            </div>
          </div>

          {error && (
            <div className="text-primary text-sm bg-primary/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-3">
            Se connecter
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Comptes de démonstration :
          </p>
          <div className="mt-2 space-y-1 text-xs text-gray-500">
            <p>Leader: admin@calzik.fr</p>
            <p>Membre: pierre@calzik.fr</p>
          </div>
        </div>
      </div>
    </div>
  );
}