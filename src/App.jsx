import { useState, useEffect, useRef, useMemo } from 'react';
import { UserList } from './components/UserList';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState('none');
  const [filterCountry, setFilterCountry] = useState(null);
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
    fetch('https://randomuser.me/api/?results=100')
      .then((res) => res.json())
      .then((json) => {
        setUsers(json.results);
        originalUsers.current = json.results;
      })
      .catch((error) => console.log(error));
  }, []);

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
          <UserList
            handleChangeSort={handleChangeSort}
            showColors={showColors}
            users={sortedUsers}
            handleDelete={handleDelete}
          />
        </main>
      </div>
    </>
  );
}

export default App;
