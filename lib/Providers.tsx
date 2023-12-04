"use client"

import { ReactNode } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { AuthProvider } from '@context/AuthContext'


const queryClient = new QueryClient();

export default function Providers({children}: {children: ReactNode}){

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}