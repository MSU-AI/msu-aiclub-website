'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { AvatarDropDown } from "./avatar-dropdown";
import { AccountData } from "~/types/profiles";
import { shouldShowNavbar } from "~/utils/navigation";
import { Menu, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import ThemeSwitcherButton from '../ui/theme-switcher-button';
import ShopifyClient from '~/utils/shopify';

export default function NavBar({
    userMetadata
}: {
    userMetadata: AccountData | null
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const pathname = usePathname();
    const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
    const gradientRef = useRef<HTMLDivElement | null>(null);

    const userType = userMetadata?.memberType;

    // Added "Shop" to navItems
    const navItems = [
        { name: "About", path: "/about" },
        { name: "Posts", path: "/posts" },
        { name: "Projects", path: "/projects" },
        { name: "Shop", path: "/shop" }, 
        { name: "Events", path: "/events" },
        { name: "Members", path: "/members" }
    ];

    const updateGradientPosition = () => {
        const activeLink = navRefs.current[pathname];
        if (activeLink && gradientRef.current) {
            const rect = activeLink.getBoundingClientRect();
            gradientRef.current.style.width = `${rect.width}px`;
            gradientRef.current.style.left = `${rect.left + window.scrollX}px`;
        }
    };

    useEffect(() => {
        updateGradientPosition();
        window.addEventListener('resize', updateGradientPosition);

        return () => {
            window.removeEventListener('resize', updateGradientPosition);
        };
    }, [pathname]);

    // Fetch cart count
    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const client = ShopifyClient.getInstance();
                // Check if the method exists before calling it
                if (typeof client.getCartItemCount === 'function') {
                    const count = await client.getCartItemCount();
                    setCartCount(count);
                } else {
                    console.error("getCartItemCount method not found on ShopifyClient");
                    // Fallback: try to get cart and calculate count manually
                    const cart = await client.getCart();
                    if (cart && cart.lineItems) {
                        const count = cart.lineItems.reduce((total, item) => total + item.quantity, 0);
                        setCartCount(count);
                    }
                }
            } catch (error) {
                console.error("Error fetching cart count:", error);
            }
        };

        fetchCartCount();
        
        // Refresh cart count every 30 seconds
        const interval = setInterval(fetchCartCount, 30000);
        
        return () => {
            clearInterval(interval);
        };
    }, []);

    // Listen for cart update events
    useEffect(() => {
        const handleCartUpdate = async () => {
            try {
                const client = ShopifyClient.getInstance();
                const count = await client.getCartItemCount();
                setCartCount(count);
            } catch (error) {
                console.error('Error updating cart count:', error);
            }
        };

        // Set up a custom event listener for cart updates
        window.addEventListener('cart:updated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cart:updated', handleCartUpdate);
        };
    }, []);

    const handleCartClick = () => {
        // Dispatch a custom event to open the cart
        const openCartEvent = new CustomEvent('cart:open');
        window.dispatchEvent(openCartEvent);
    };

    if (!shouldShowNavbar(pathname)) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full z-[80] bg-background border-b border-border">
            <div className="max-w-screen-lg flex items-center justify-between mx-auto px-4 py-2">
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="MSU AI Club Logo"
                            width={55}
                            height={55}
                        />
                    </Link>
                    <ul className="hidden md:flex space-x-6 ml-8">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    ref={(el) => (navRefs.current[item.path] = el)}
                                    className={`hover:text-foreground/70 ${
                                        pathname === item.path ? 'font-bold' : ''
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Cart icon with count badge */}
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="relative"
                        onClick={handleCartClick}
                        aria-label="Shopping cart"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ">
                                {cartCount}
                            </span>
                        )}
                    </Button>
                    
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                    >
                        <Menu />
                    </Button>

                    {(userType === "member" || userType === "admin") ? (
                        <AvatarDropDown userMetadata={userMetadata} />
                    ) : (
                        <>
                        <ThemeSwitcherButton />
                        <Link href="/auth/login">
                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="button"
                                className="bg-black px-4 py-2"
                            >
                                <span>Join Us</span>
                            </HoverBorderGradient>
                        </Link>
                        </>
                    )}
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <ul className="flex flex-col items-center py-4">
                        {navItems.map((item) => (
                            <li key={item.path} className="py-2">
                                <Link
                                    href={item.path}
                                    className="hover:text-accent"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div
                ref={gradientRef}
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-transparent via-foreground to-transparent transition-all duration-300"
                style={{ width: '0px', left: '0px' }}
            ></div>
        </div>
    );
}
