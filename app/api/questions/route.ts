import { NextResponse } from 'next/server'

import { createQuestions } from "@lib/actions/game.actions"

export async function POST(request: Request) {
  try {
    console.log("init POST")
    const req = await request.json()
    const response = await createQuestions(req)
    console.log("RESPOOOONSE", response)
    return NextResponse.json(response)
  } catch (error) {
    return new Response(`Server Error: ${error}`, { status: 500 })
  }

}