"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { register } from "~/server/actions/auth";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const params = useSearchParams();

    useMemo(() => {
        setMessage(params.get('message') ?? '');
    }, [params])

    
    const handleSubmit = async () => {
        await register(email, password);
        
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
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">Register</div>
                {message && <p className="text-red-500">{message}</p>}
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
                <p>Already have an account?    </p>         
                <Link href="/auth/login" className="underline">
                    Sign in
                </Link>
                <Button onPress={() => handleSubmit()} className="w-full">
                    Register
                </Button>
            </CardFooter>
        </Card>
    )
}
