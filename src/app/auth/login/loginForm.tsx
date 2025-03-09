"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Spacer } from "@nextui-org/react";
import { Label } from "@radix-ui/react-label";
import { login, loginWithGoogle } from "~/server/actions/auth";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check if there's a success message from password reset
        const urlMessage = searchParams.get('message');
        if (urlMessage) {
            setMessage(urlMessage);
            toast.success(urlMessage, {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                    border: '2px solid #333',
                    color: '#fff',
                    backgroundColor: '#333',
                },
            });
        }
    }, [searchParams]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await login(email, password);

            if (res) {
                setMessage(res);
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
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="flex flex-col bg-background mx-auto min-w-[400px] min-h-[450px] max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-m flex flex-col gap-4">
            <Spacer/>
            <Button 
            variant="secondary" 
            className="w-full gap-3"
            onClick={() => loginWithGoogle()}
            >
                <Image
                src={'/google.svg'}
                alt="Google"
                width={20}
                height={20}
                >
                </Image>
                Login with Google
            </Button>
            </CardDescription>
        </CardHeader>
        <div className="flex flex-row justify-center text-center items-center gap-4">
            <Separator className="w-2/5" />
            <p className="w-1/5">Or</p>
            <Separator className="w-2/5" />
        </div>
        <CardContent>
            <div className="grid gap-4">
                {message && <Label className={message.includes('successfully') ? 'text-green-500' : 'text-red-500'}>{message}</Label>}
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-blue-500 hover:underline">
                        Forgot Password?
                    </Link>
                </div>
                <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <Button 
                onClick={handleSubmit} 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            </div>
            <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
                Sign up
            </Link>
            </div>
        </CardContent>
        </Card>
    )
}
