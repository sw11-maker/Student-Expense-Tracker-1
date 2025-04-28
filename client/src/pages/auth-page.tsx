import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Registration schema
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
    },
  });

  // Handle login form submission
  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  // Handle registration form submission
  function onRegisterSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full mx-auto grid md:grid-cols-2 gap-6">
        {/* Left column - Auth forms */}
        <div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your budget dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Sign up to start managing your student finances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.smith@sjsu.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Register"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - App description and features */}
        <div className="hidden md:block">
          <div className="h-full flex flex-col justify-center">
            <div className="bg-primary/10 p-8 rounded-lg border border-primary/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center mr-4">
                  <span className="material-icons text-white text-2xl">account_balance_wallet</span>
                </div>
                <h1 className="text-2xl font-bold text-neutral-800">SJSU Student Budget Tool</h1>
              </div>
              
              <h2 className="text-xl font-semibold mb-4 text-neutral-800">
                Take control of your student finances
              </h2>
              
              <p className="text-neutral-600 mb-6">
                Our budget tool helps SJSU students manage their finances effectively, 
                with features specifically designed for student needs.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-2">check_circle</span>
                  <div>
                    <h3 className="font-medium text-neutral-800">Track Your Expenses</h3>
                    <p className="text-sm text-neutral-600">
                      Log and categorize expenses to see where your money is going
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-2">check_circle</span>
                  <div>
                    <h3 className="font-medium text-neutral-800">Budget for the Semester</h3>
                    <p className="text-sm text-neutral-600">
                      Plan ahead for tuition, books, housing, and other campus expenses
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-2">check_circle</span>
                  <div>
                    <h3 className="font-medium text-neutral-800">Discover Campus Deals</h3>
                    <p className="text-sm text-neutral-600">
                      Find student discounts and special offers to make your money go further
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-2">check_circle</span>
                  <div>
                    <h3 className="font-medium text-neutral-800">Financial Education</h3>
                    <p className="text-sm text-neutral-600">
                      Learn money management skills that will serve you beyond graduation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
