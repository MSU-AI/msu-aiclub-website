"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, loginWithGoogle } from "~/server/actions/auth";
import { toast } from "react-hot-toast";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = async () => {
        const res = await login(email, password);

        if (res) {
            toast.error('error', {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                    border: '2px solid #333',
                    color: '#fff',
                    backgroundColor: '#333',
                },
                });
        } else {
            toast.success('Successfully logged in!', {
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
        <Card className="min-w-[400px] p-4">
            <CardHeader className="flex flex-col gap-3">
                <div className="flex flex-col">Login</div>
            </CardHeader>
            <CardBody className="gap-3">
                <Input 
                size="sm" 
                type="email" 
                label="Email" 
                name="email" 
                onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                size="sm" 
                type="password" 
                label="Password" 
                name="password" 
                onChange={(e) => setPassword(e.target.value)}
                />
            </CardBody>
            <CardFooter className="flex flex-col gap-3">
                <p>Don&apos;t have an account</p>      
                <Link href="/auth/register" className="underline">
                    Sign up
                </Link>
                <Button onPress={() => handleSubmit()} className="w-full">
                    Login
                </Button>
                <Button onPress={() => loginWithGoogle()} className="w-full">
                    Login With Google
                </Button>
            </CardFooter>
        </Card>
    )
}
