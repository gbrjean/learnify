"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import logo from "@public/assets/icons/LOGO.svg"
import Default from "@public/assets/images/pfp.png"

const Header = () => {

  const { data: session } = useSession()

  return (
    <header>
      <div className="container">

        <Link href="/"><Image src={logo} height={36} alt="" /></Link>
        <nav>
          { (session && session.user) ? (
              session.user.image ? (
                <Link href={'/profile'}>
                  <Image src={session.user.image} width={36} height={36} alt="" />
                </Link>
              ) : (
                <Link href="/profile">
                  <Image src={Default} width={36} height={36} alt="" />
                </Link>
              )
          ) : (
            <Link href="/login">
              <Image src={Default} width={36} height={36} alt="" />
            </Link>
          )}
        </nav>

      </div>
    </header>
  )
}

export default Header