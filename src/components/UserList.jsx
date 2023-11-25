export function UserList({
  handleChangeSort,
  handleDelete,
  showColors,
  users,
}) {
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Foto</th>
          <th
            className='pointer'
            onClick={() => handleChangeSort('name')}>
            Nombre
          </th>
          <th
            className='pointer'
            onClick={() => handleChangeSort('last')}>
            Apellido
          </th>
          <th
            className='pointer'
            onClick={() => handleChangeSort('country')}>
            País
          </th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody className={showColors ? 'table--showColors' : 'table'}>
        {users.map((user) => {
          return (
            <tr key={user.email}>
              <td>
                <img
                  src={user.picture.thumbnail}
                  alt='l'
                />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button
                  onClick={() => {
                    handleDelete(user.email);
                  }}>
                  Eliminar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
