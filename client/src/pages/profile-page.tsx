import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Profile update schema
const profileUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
});

type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });
  
  // This is a placeholder function - profile updating would require a server endpoint
  function onSubmit(values: ProfileUpdateValues) {
    // In a real implementation, this would be an API call
    console.log("Profile update values:", values);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
    
    setIsEditing(false);
  }
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  // Format the createdAt date
  const formattedJoinDate = user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A';
  
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="container py-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-12">
          {/* Profile Info */}
          <div className="md:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  View and edit your account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex space-x-2 pt-2">
                        <Button type="submit">Save Changes</Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-neutral-500">Username</Label>
                      <div className="text-lg font-medium mt-1">{user.username}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-neutral-500">Full Name</Label>
                      <div className="text-lg font-medium mt-1">{user.fullName}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-neutral-500">Email</Label>
                      <div className="text-lg font-medium mt-1">{user.email}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-neutral-500">Member Since</Label>
                      <div className="text-lg font-medium mt-1">{formattedJoinDate}</div>
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={() => setIsEditing(true)}
                      className="mt-4"
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Account Settings */}
          <div className="md:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Password</h3>
                  <p className="text-sm text-neutral-500 mb-3">
                    Change your password to keep your account secure
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="font-medium mb-2">Notifications</h3>
                  <p className="text-sm text-neutral-500 mb-3">
                    Manage how you receive alerts and notifications
                  </p>
                  <Button variant="outline">Notification Settings</Button>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="font-medium mb-2">Export Data</h3>
                  <p className="text-sm text-neutral-500 mb-3">
                    Download a copy of your financial data
                  </p>
                  <Button variant="outline">Export All Data</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}