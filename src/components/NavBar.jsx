import { signOut } from 'firebase/auth';

function NavBar({ auth, setUser, setPageBody }) {
  const logOut = (e) => {
    e.preventDefault();

    signOut(auth)
      .then(() => {
        console.log('sign out successful');
        setUser(null);
        setPageBody('LogIn');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="navbar bg-base-100">
      
        <div className="navbar-start">
          <button className="btn btn-ghost btn-circle" onClick={() => setPageBody('Profile')}>
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 18">
              <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
            </svg>
          </button>
        </div>

        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-xl" onClick={() => setPageBody('Lifts')}>XL</a>
        </div>

        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle" title="log out" onClick={logOut}>
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 15">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"/>
            </svg>
          </button>
        </div>
  
      </div>
    </div>
  );
}

export default NavBar;
