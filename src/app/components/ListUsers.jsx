"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import Fila from "../components/Fila";
import Search from "../components/Search";
import NewUser from "../components/NewUser";
import SearchIcon from "../assets/searchIcon";
import AddUserIcon from "../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";
import UserIcon from "../assets/UserIcon";

export default function ListUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageCurrent, setPageCurrent] = useState(0);

  const searchParams = useSearchParams();
  const isAddingNewUser = searchParams.get("new") === "1";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await axios.get("/api/admin");
      setUsuarios(data);
      setFilteredUsers(data);
    }
    fetchUsers();
  }, [isAddingNewUser]);

  useEffect(() => {
    setSearchTerm(searchQuery); // Establecer el término de búsqueda desde la URL

    const results = usuarios.filter(user => {
      const searchWords = searchTerm.toLowerCase().trim().split(/\s+/); // Dividir en palabras
      return searchWords.every(word => (
        user.us_nombres.toLowerCase().includes(word) ||
        user.us_apellido_paterno.toLowerCase().includes(word) ||
        user.us_apellido_materno.toLowerCase().includes(word) ||
        user.gen_descripcion.toLowerCase().includes(word) ||
        user.rol_descripcion.toLowerCase().includes(word) ||
        user.esc_descripcion.toLowerCase().includes(word) ||
        user.es_descripcion.toLowerCase().includes(word)
      ));
    });

    setFilteredUsers(results);
    setPageCurrent(0);
  }, [searchTerm, usuarios, searchQuery]);

  const pages = Math.ceil(filteredUsers.length / 15);
  const usersPag = filteredUsers.slice(pageCurrent * 15, (pageCurrent + 1) * 15);

  const getPagination = () => {
    const pagination = [];
    const paginationRange = 3;

    let startPage = Math.floor(pageCurrent / paginationRange) * paginationRange + 1;
    let endPage = Math.min(startPage + paginationRange - 1, pages);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }

    return pagination;
  };

  const pagination = getPagination();
  const hasPreviousPage = pageCurrent > 0;
  const hasNextPage = pageCurrent < pages - 1;

  let noUserMessage = "";

  if (usuarios.length === 0) {
    noUserMessage = "no hay usuarios registrados.";
  } else if (filteredUsers.length === 0) {
    noUserMessage = "no hay usuarios que coincidan con tu búsqueda.";
  }

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <section className="container_clients">
      <h1 className="title">usuarios</h1>
      <span className="description">la sección de usuarios ofrece una visión completa de todos los miembros registrados en la plataforma.</span><br /><br />

      <div className="container_add">
        <div className="container_search">
          <Search onSearch={handleSearch} />
          <SearchIcon className="search_icon" />
        </div>

        <Link href="/admin/usuarios?new=1">
          <div className="container_btn">
            <AddUserIcon width={18} />
            <span>Agregar</span>
          </div>
        </Link>
      </div><br />

      <div className="container_table">
        {usersPag.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>nombre(s)</th>
                <th>apellido paterno</th>
                <th>apellido materno</th>
                <th>género</th>
                <th>cargo</th>
                <th>escuela</th>
                <th>estado</th>
              </tr>
            </thead>
            <tbody>
              {usersPag.map((usuarios) => (
                <Fila usuarios={usuarios} key={usuarios.us_id} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="search_not_exit">
            <p>{noUserMessage}</p><br />
            <UserIcon />
          </div>
        )}
      </div><br />

      {pages > 1 && (
        <div className="container_page">
          <nav className="nav_page" aria-label="Pagination">
            {hasPreviousPage && (
              <button onClick={() => setPageCurrent(pageCurrent - 1)} className="previous">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {pagination.map((pag, index) => {
              const isActive = pageCurrent + 1 === pag;
              const activeClass = isActive ? "z-10 bg-blue-950 text-white focus-visible:outline-indigo-600" : "text-blue-950 ring-1 ring-inset ring-gray-300 hover:bg-gray-50";

              return (
                <button key={index} onClick={() => setPageCurrent(pag - 1)} className={`page ${activeClass}`}>
                  {pag}
                </button>
              );
            })}

            {hasNextPage && (
              <button onClick={() => setPageCurrent(pageCurrent + 1)} className="next">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </nav>
        </div>
      )}

      <NewUser show={isAddingNewUser} />
    </section>
  );
}
