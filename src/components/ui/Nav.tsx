/*
This is the top navigation bar with buttons for signing in and checking users events
Buttons will be discussed later on whether to create a link for a user page or a cart page
or both.
*/
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'

const Nav = () => {

  const isUserLoggedIn = true;

  type Provider = { id: string; name: string };
  const [providers, setProviders ] = useState<Record<string, Provider> | null>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = (await getProviders()) as Record<string, Provider> | null;
        setProviders(response);
      } catch (err) {
        console.error('Error fetching providers', err);
      }
    }

    fetchProviders();
  }, [])
  return (
    <>
      <nav className="flex items-center justify-between w-full pt-5 pb-3 pr-4 sm:pt-8 sm:pr-8">
        <Link href='/' className="flex gap-2 flex-center">
        <Image 
        src="/next.svg" 
        alt="Logo" 
        width = {120} 
        height={24} 
        className="object-contain p-2 border-red-500"
        priority/>
        <p className="logo_text font-cursive text-4xl bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent leading-none tracking-tight">
          EVENT PLANNER
        </p>
        </Link>
        {/*desktop navigation */}
        <div className="sm:flex hidden ">
          {isUserLoggedIn ? (
            <div className="flex gap-3 md:gap-5">
              <Link href="/create-prompt"
              className='ml-3 hidden sm:inline rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500
  px-3 py-1 text-xs font-semibold text-white shadow-sm pt-3'>
                Planner
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="outline_btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Account
              </button>

              <div className="relative">
    <button
      type="button"
      onClick={() => setToggleDropdown(v => !v)}
      className="p-0 bg-transparent border-0"
      aria-expanded={toggleDropdown}
      aria-label="Profile menu"
    >
      <Image
        src={"/next.svg"} 
        alt="profile"
        width={64}
        height={64}
        className="object-cover ring-2 ring-black/1"
      />
    </button>

    {toggleDropdown && (
      <div className="absolute right-0 top-full mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 p-2 z-50 flex flex-col gap-1">
        <Link
          href="/profile"
          className="block w-full rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-normal"
          onClick={() => setToggleDropdown(false)}
        >
          Cart
        </Link>
        <Link
          href="/create-prompt"
          className="block w-full rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-normal"
          onClick={() => setToggleDropdown(false)}
        >
          Log In
        </Link>
        <button
          type="button"
          onClick={() => { setToggleDropdown(false); signOut(); }}
          className="mt-2 block w-full rounded px-3 py-2 text-left text-sm bg-black text-white hover:bg-gray-800"
        >
          Sign Out
        </button>
      </div>
    )}
  </div>
</div>
          ): (
            <>
              {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.id}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign in with {provider.name}
                </button>
                ))}
                </>
          )}
        </div>

        <div className='sm:hidden flex relative'>
          {/*mobile navigation can be implemented here if needed */}
        { isUserLoggedIn ? (
          <div className="flex">
            <button
              type="button"
              onClick={() => setToggleDropdown((prev) => !prev)}
              className="p-0 bg-transparent border-0"
              aria-expanded={toggleDropdown}
              aria-label="Profile menu"
            >
              <Image
                src="/next.svg"
                width={37}
                height={37}
                className='rounded-full '
                alt="profile"
              />
            </button>

            {toggleDropdown && (
              <div className="dropdown">
                <Link href="/profile"
                className='dropdown_link'
                onClick={() => setToggleDropdown(false)}>
                  Profile
                </Link>
                <Link href="/create-prompt"
                className='dropdown_link'
                onClick={() => setToggleDropdown(false)}>
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {setToggleDropdown(false); signOut()}}
                  className="mt-5 w-full black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.id}
                  onClick={() => signIn(provider.id)}
                  className="black_btn"
                >
                  Sign in with {provider.name}
                </button>
              ))}
          </div>
        )}
        </div>
      </nav>
    </>
  )
}

export default Nav