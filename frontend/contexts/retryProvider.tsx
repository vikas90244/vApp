'use client';
import { useRetryQueue } from "@/hooks/useRetryQueue";
export default function RetryProvider({children}:{children: React.ReactNode}){
        useRetryQueue();
    
    return <>{children}</>
}