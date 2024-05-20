"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "~/server/actions/auth";
import { toast } from "react-hot-toast";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    
    const handleSubmit = async () => {
        const res = await register(email, password);
        
        if (res) {
            toast.success('Error logging in', {
            duration: 4000, 
            position: 'bottom-right', 
            style: {
                border: '2px solid #333',
                color: '#fff',
                backgroundColor: '#333',
            },
            });
        } else {
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
        <Card className="min-w-[400px] p-4">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">Register</div>
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
