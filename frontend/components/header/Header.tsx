'use client'

import React, { useState, useEffect } from 'react'
import { Compass, Plus, User, Vote, Zap, Menu, X } from 'lucide-react'
import WalletButton from '../buttons/Wallet-Button'
import { useNetwork } from '@/contexts/Wallet-Provider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

function Header() {
  const { network, setNetwork } = useNetwork()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const NavLink = ({
    href,
    children,
    icon: Icon,
    mobile = false,
  }: {
    href: string
    children: React.ReactNode
    icon?: React.ElementType
    mobile?: boolean
  }) => (
    <Link
      href={href}
      className={cn(
        'px-3 sm:px-4 py-2 font-black border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
        'text-sm sm:text-base transition-all duration-150 flex items-center gap-2',
        'hover:bg-yellow-100 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        pathname === href ? 'bg-yellow-300 text-black' : 'bg-white',
        mobile ? 'w-full justify-center' : ''
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  )

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 bg-white border-b-4 border-black shadow-lg transition-all duration-300',
        isScrolled ? 'py-1' : 'py-2'
      )}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between py-2 md:py-3 lg:py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <div className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-yellow-400 border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-6deg] flex items-center justify-center">
              <Vote className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 text-black" strokeWidth={2.5} />
            </div>
            <h1 className="text-base md:text-xl lg:text-2xl font-black text-black leading-tight whitespace-nowrap truncate">
              <span className="hidden md:inline">DECENTRALIZED </span>
              <span className="inline">DECISIONS</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3 md:gap-4 lg:gap-6">
            <NavLink href="/explore" icon={Compass}>
              Explore
            </NavLink>
            <NavLink href="/my-polls" icon={User}>
              My Polls
            </NavLink>
            <NavLink href="/create-poll" icon={Plus}>
              Create Poll
            </NavLink>
          </nav>

          {/* Network + Wallet - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() =>
                setNetwork(network === 'devnet' ? 'localnet' : 'devnet')
              }
              className={cn(
                'px-3 py-2 font-bold border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
                'flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap',
                network === 'devnet'
                  ? 'bg-blue-400 text-white hover:bg-blue-500'
                  : 'bg-pink-300 text-black hover:bg-pink-400'
              )}
            >
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              {network === 'devnet' ? 'Devnet' : 'Localnet'}
            </button>
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2 text-gray-800 hover:text-gray-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

          {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-black py-4 px-4 fixed inset-x-0 top-[64px] z-40">
          <div className="flex flex-col space-y-3 max-h-[60vh] overflow-auto">
            <NavLink href="/explore" icon={Compass} mobile>
              Explore
            </NavLink>
            <NavLink href="/my-polls" icon={User} mobile>
              My Polls
            </NavLink>
            <NavLink href="/create-poll" icon={Plus} mobile>
              Create Poll
            </NavLink>
            
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() =>
                  setNetwork(network === 'devnet' ? 'localnet' : 'devnet')
                }
                className={cn(
                  'px-3 py-2 font-bold border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
                  'flex items-center gap-2 text-sm w-full justify-center',
                  network === 'devnet'
                    ? 'bg-blue-400 text-white hover:bg-blue-500'
                    : 'bg-pink-300 text-black hover:bg-pink-400'
                )}
              >
                <Zap className="w-4 h-4" />
                {network === 'devnet' ? 'Devnet' : 'Localnet'}
              </button>
              <div className="w-full">
                <WalletButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
