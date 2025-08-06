import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const AuthDialog = () => {
  const [tab, setTab] = useState("signin");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Open authentication dialog">
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tab === "signin" ? "Welcome back" : "Create your account"}</DialogTitle>
          <DialogDescription>
            {tab === "signin"
              ? "Sign in to continue your magical journey."
              : "Join Spelltale to begin an infinite AI-powered adventure."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>
            <Button className="w-full" aria-label="Sign in" disabled>
              Continue
            </Button>
            <div className="text-xs text-muted-foreground text-center">UI only – not connected yet</div>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="secondary" className="w-full" aria-label="Continue with Google" disabled>
                Continue with Google
              </Button>
              <Button variant="secondary" className="w-full" aria-label="Continue with GitHub" disabled>
                Continue with GitHub
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Your name" autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-up">Email</Label>
              <Input id="email-up" type="email" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-up">Password</Label>
              <Input id="password-up" type="password" placeholder="Create a password" autoComplete="new-password" />
            </div>
            <Button className="w-full" aria-label="Create account" disabled>
              Create account
            </Button>
            <div className="text-xs text-muted-foreground text-center">UI only – not connected yet</div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
