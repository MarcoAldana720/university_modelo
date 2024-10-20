"use client"

import Link from 'next/link';
import HomeIcon from '../assets/HomeIcon';
import UserIcon from '../assets/UserIcon';
import CloseIcon from '../assets/CloseIcon';

export default function Aside({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay para el menú en tablet y móvil */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ease-in-out duration-500 ${
          isOpen ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
        } lg:hidden`} onClick={onClose} />

      {/* Menú lateral */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-primary text-white transition-transform ease-in-out duration-500 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-screen md:w-[50vw] lg:relative lg:translate-x-0 lg:w-64`} >

        <div className="relative">
          {/* Botón para cerrar el menú en pantallas pequeñas */}
          <button className="absolute top-1/2 right-4 transform -translate-y-1/2 lg:hidden text-white" onClick={onClose} >
            <CloseIcon width={24} />
          </button>

          <figure className="h-20 flex items-center justify-center border-b border-gray-700">
            <img src="/img/logo_blanco.png" alt="logo blanco" className="block object-cover max-w-[150px]" />
          </figure>
        </div>

        <nav className="mt-6 px-3">
          <Link href="/admin/dashboard" className="flex px-3 rounded-md items-center gap-2 py-3 transition duration-300 hover:bg-white hover:text-primary group/link" onClick={onClose}>
            <HomeIcon width={20} className="fill-white group-hover/link:fill-primary inline-block" />
            Panel De Control
          </Link>

          <Link href="/admin/usuarios" className="flex px-3 rounded-md items-center gap-2 py-3 transition duration-300 hover:bg-white hover:text-primary group/link" onClick={onClose}>
            <UserIcon width={20} className="fill-white group-hover/link:fill-primary inline-block" />
            Usuarios
          </Link>
        </nav>
      </aside>
    </>
  );
}
