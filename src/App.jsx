import { useState, useEffect, useRef, useMemo } from 'react';
import { UserList } from './components/UserList';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState('none');
  const [filterCountry, setFilterCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const originalUsers = useRef([]);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const toggleSorByCountry = () => {
    const newSort = sorting === 'none' ? 'country' : 'none';
    setSorting(newSort);
  };

  const handleDelete = (email) => {
    const filteredUsers = users.filter((user) => user.email !== email);
    setUsers(filteredUsers);
  };

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  const handleChangeSort = (sort) => {
    setSorting(sort);
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(
      `https://randomuser.me/api/?results=10&seed=adriane121000&page=${currentPage}`
    )
      .then((res) => {
        if (!res.ok) throw new Error('Error en la peticion');
        return res.json();
      })
      .then((json) => {
        setUsers((prevUsers) => {
          const newUsers = prevUsers.concat(json.results);
          originalUsers.current = newUsers;
          return newUsers;
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    if (sorting === 'none') {
      return filteredUsers;
    }
    if (sorting === 'country') {
      return sorting
        ? filteredUsers.toSorted((a, b) =>
            a.location.country.localeCompare(b.location.country)
          )
        : filteredUsers;
    }
    if (sorting === 'name') {
      return sorting
        ? filteredUsers.toSorted((a, b) =>
            a.name.first.localeCompare(b.name.first)
          )
        : filteredUsers;
    }
    if (sorting === 'last') {
      return sorting
        ? filteredUsers.toSorted((a, b) =>
            a.name.last.localeCompare(b.name.last)
          )
        : filteredUsers;
    }
  }, [filteredUsers, sorting]);

  return (
    <>
      <div className='App'>
        <h1>Lista de Usuarios Prueba Tecnica</h1>
        <header>
          <button onClick={toggleColors}>Colorear filas</button>
          <button onClick={toggleSorByCountry}>
            {sorting === 'country' ? 'No Ordenar Por País' : 'Ordenar Por País'}
          </button>
          <button onClick={handleReset}>Recuperar Usuarios</button>
          <input
            placeholder='Filtra por país'
            onChange={(e) => {
              setFilterCountry(e.target.value);
            }}
          />
        </header>
        <main>
          {users.length > 0 && (
            <UserList
              handleChangeSort={handleChangeSort}
              showColors={showColors}
              users={sortedUsers}
              handleDelete={handleDelete}
            />
          )}
          {loading && <p>Cargando...</p>}
          {error && <p>Ha habido un error</p>}
          {!error && users.length === 0 && <p>No hay usuarios</p>}

          {!loading && !error && (
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              Cargar mas resultados
            </button>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
