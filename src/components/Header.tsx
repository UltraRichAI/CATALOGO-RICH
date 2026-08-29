import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  Grid,
  Menu,
  X,
  Lock,
  MessageCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { APP_CONFIG } from '../config/index.ts';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp.ts';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  navigate,
  isAdminLoggedIn = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const waUrl = getGeneralWhatsAppUrl();

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Inicio', route: '/' },
    { label: 'Catálogo', route: '/productos' },
    { label: 'Categorías', route: '/categorias' },
  ];

  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Brand / Logo */}
          <button
            type="button"
            id="brand-logo-btn"
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 font-extrabold text-sm shadow-xs group-hover:bg-slate-800 transition-colors border border-slate-800">
              RP
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tight text-slate-900 leading-tight">
                RICH<span className="text-emerald-600 font-extrabold">.PRO</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Cuentas & Suscripciones
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const isActive =
                currentRoute === link.route ||
                (link.route !== '/' && currentRoute.startsWith(link.route));
              return (
                <button
                  key={link.route}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  type="button"
                  onClick={() => handleNav(link.route)}
                  className={`text-sm font-semibold transition-colors pb-1 border-b-2 cursor-pointer ${
                    isActive
                      ? 'text-slate-900 border-emerald-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900 border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* WhatsApp Quick Link */}
            <a
              id="header-wa-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* Geometric divider */}
            <div className="hidden md:block h-4 w-px bg-slate-200 mx-1"></div>

            {/* Cart Button */}
            <button
              type="button"
              id="cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none cursor-pointer"
              aria-label={`Ver carrito con ${totalItems} productos`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-slate-700 hover:text-slate-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs animate-scale-in"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin Pill Button - ONLY visible when admin is logged in */}
            {isAdminLoggedIn && (
              <button
                type="button"
                id="admin-access-btn"
                onClick={() => handleNav('/admin')}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentRoute.startsWith('/admin')
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
                title="Panel Administrativo"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Panel Admin</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg"
        >
          {navLinks.map((link) => {
            const isActive =
              currentRoute === link.route ||
              (link.route !== '/' && currentRoute.startsWith(link.route));
            return (
              <button
                key={link.route}
                type="button"
                id={`mobile-nav-${link.label.toLowerCase()}`}
                onClick={() => handleNav(link.route)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              id="mobile-menu-wa-link"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-semibold text-sm border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
