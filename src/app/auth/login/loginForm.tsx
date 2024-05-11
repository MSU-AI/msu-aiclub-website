"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { login } from "~/server/actions/auth";

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
    }

    return (
        <Card className="min-w-[400px] p-4">
            <CardHeader className="flex flex-col gap-3">
                <div className="flex flex-col">Login</div>
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