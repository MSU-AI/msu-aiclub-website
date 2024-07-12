"use client";

import Link from "next/link";
import { createClient } from "~/utils/supabase/client";

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"


import { useRouter } from "next/navigation";
import { useState } from "react";
import { register, loginWithGoogle } from "~/server/actions/auth";
import { toast } from "react-hot-toast";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();
    
    const handleSubmit = async () => {
        const res = await register(email, password);
        setMessage(res || ''); 
        if (res) {
            toast.error(res, {
            duration: 4000, 
            position: 'bottom-right', 
            style: {
                border: '2px solid #333',
                color: '#fff',
                backgroundColor: '#333',
            },
            });
        } else {
            console.log("registered successfully")
            toast.success('Registered successfully', {
            duration: 4000, 
            position: 'bottom-right', 
            style: {
                border: '2px solid #333',
                color: '#fff',
                backgroundColor: '#333',
            }, 
            });

            router.push('/');
        }

    }

    return (
        <Card className="bg-background min-w-[400px] p-4">
            <CardHeader className="flex flex-col gap-3">
                <div className="flex flex-col">Register</div>
                {message && <p className="text-destructive">{message}</p>}
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Input 
                type="email" 
                name="email" 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@xyz.com"
                />
                <Input 
                type="password" 
                name="password" 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                <p>Already have an account?</p>      
                <Link href="/auth/login" className="underline">
                    Login
                </Link>
                <Button onClick={() => handleSubmit()} className="w-full">
                    Register
                </Button>
                <div className="inline-flex items-center justify-center w-full">
                  <hr className="w-full h-px my-8 bg-secondary border-0 " />
                  <span className="absolute px-3 font-medium bg-background text-foreground -translate-x-1/2  left-1/2 ">or</span>
                </div> 
                <Button onClick={() => loginWithGoogle()} className="w-full flex gap-2">
                    Register with Google
                </Button>

            </CardFooter>
        </Card>
    )
}
