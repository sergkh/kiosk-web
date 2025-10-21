import { NavLink, Outlet } from "react-router";
import './AdminLayout.css';
import { AuthorizedRoute, useAuth } from "./AuthorizedRoute";


function AdminAvatar() {
  const { user } = useAuth();
  return (
    <div className="admin-avatar">
      {user?.picture ? (
        <img src={user.picture} alt={user.email || "Admin Avatar"} />
      ) : (
        <span className="default-avatar">A</span>
      )}
    </div>
  );
}

export default function AdminLayout() {
  return (<AuthorizedRoute>
      <header>
        <span className="left"></span>
        <nav className="center">
        <NavLink to="/admin/" end className={({isActive, isPending}) =>  isActive ? 'nav-link-active' :isPending ? 'nav-link-pending'  : ''}> Студентам </NavLink>
        <NavLink to="./abiturients" end className={({isActive, isPending }) =>  isActive ? 'nav-link-active':  isPending ? 'nav-link-pending' : ''}> Абітурієнтам </NavLink>
        
        </nav>
        {/* <nav className="center">
          <ul>
            <li><NavLink to="/admin/" className="nav-link">Студентам</NavLink></li>
            <li><NavLink to="/admin/abiturients" className="nav-link">Абітурієнтам</NavLink></li>
          </ul>
        </nav> */}

        <div className="right">
          <AdminAvatar/>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </AuthorizedRoute>);
}