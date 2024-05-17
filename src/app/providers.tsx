'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ChakraProvider } from '@chakra-ui/react'


export function Providers({children}: { children: React.ReactNode }) {
    return (
        <ChakraProvider>
        <NextUIProvider>
            {children}
        </NextUIProvider>
        </ChakraProvider>
    )
}
