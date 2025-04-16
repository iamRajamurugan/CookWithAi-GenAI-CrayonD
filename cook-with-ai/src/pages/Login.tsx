import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, Loader2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { signIn, isLoading } = useAuth();
  const [loginError, setLoginError] = React.useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(null);
      await signIn(data.email, data.password);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerChildren = {
    animate: { 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 flex items-center justify-center p-4">
      <motion.div 
        className="text-center bg-card p-8 rounded-xl shadow-md md:shadow-lg border border-border/50 max-w-md w-full backdrop-blur-sm"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors absolute top-4 left-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> 
          <span>Back to Home</span>
        </Link>
        
        <motion.div variants={fadeIn}>
          <ChefHat className="h-16 w-16 mx-auto text-primary mb-6 float-animation" />
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to access your recipe assistant
          </p>
        </motion.div>
        
        {loginError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <motion.div variants={staggerChildren}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={fadeIn}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <Button 
                  type="submit" 
                  className="w-full mt-4 h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
        
        <motion.div 
          className="mt-6 text-sm text-muted-foreground"
          variants={fadeIn}
        >
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium transition-colors">
            Sign Up
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
