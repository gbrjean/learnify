"use client"

import { MascotLogo } from '@public/assets/icons/mascotLogo'
import '@styles/login/login.scss'
import Image from 'next/image'
import google from "@public/assets/images/google.png"
import facebook from "@public/assets/images/facebook.png"
import { signIn } from 'next-auth/react'

const Login = () => {
  return (
    <section className="card">
      <MascotLogo />
      <div className="content">
        <h1>Welcome to Learnify!</h1>
        <p>Learnify is a platform for creating quizzes using the spaced repetition learning technique and artificial intelligence. Get started by logging in below!</p>
        <button className='btn-gray' onClick={() => signIn("google", {callbackUrl: "/"})}>
          <Image src={google} alt="" />
          <span>Sign In with Google</span>
        </button>
        <button className='btn-gray' onClick={() => signIn("facebook", {callbackUrl: "/"})}>
          <Image src={facebook} alt="" />
          <span>Sign In with Facebook</span>
        </button>
      </div>
    </section>
  )
}

export default Login