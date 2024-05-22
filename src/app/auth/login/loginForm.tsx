"use client";
import Link from "next/link";

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

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { login } from "~/server/actions/auth";
import { toast } from "react-hot-toast";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const params = useSearchParams();

    useMemo(() => {
        setMessage(params.get('message') ?? '');
    }, [params])

    const handleSubmit = async () => {
        await login(email, password);
        
        // this is a hackish solution but it just checks if the params in url are empty (aka no error message)
        if (params.size === 0) {
            toast.success('Successfully logged in!', {
            duration: 4000, 
            position: 'bottom-right', 
            style: {
                border: '2px solid #333',
                color: '#fff',
                backgroundColor: '#333',
            },
            });
        }

    }

    return (
        <Card className="min-w-[400px] p-4">
            <CardHeader className="flex flex-col gap-3">
                <div className="flex flex-col">Login</div>
                {message && <p className="text-red-500">{message}</p>}
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Input 
                size="sm" 
                type="email" 
                label="Email" 
                name="email" 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@xyz.com"
                />
                <Input 
                size="sm" 
                type="password" 
                label="Password" 
                name="password" 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                <p>Don&apos;t have an account</p>      
                <Link href="/auth/register" className="underline">
                    Sign up
                </Link>
                <Button onPress={() => handleSubmit()} className="w-full">
                    Login
                </Button>
            </CardFooter>
        </Card>
    )
}
