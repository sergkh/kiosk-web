import { NavLink, Outlet } from "react-router";
import './AdminLayout.css';
import { AuthorizedRoute, useAuth } from "./AuthorizedRoute";


function AdminAvatar() {
  const { user } = useAuth();
  return (
    <div className="admin-avatar">
      <a href="/api/auth/logout" className="logout">
        {user?.picture ? (
          <img src={user.picture} alt={user.email || "Admin Avatar"} />
        ) : (
          <span className="default-avatar">A</span>
        )}
      </a>
    </div>
  );
}

export default function AdminLayout() {
  return (<AuthorizedRoute>
      <header>
        <span className="left"></span>
        <nav className="center">
          <NavLink to="/admin/categories/students" end className={({isActive}) =>  isActive ? 'nav-link-active': 'nav-link'}>Студентам</NavLink>
          <NavLink to="/admin/categories/abiturients" end className={({isActive }) =>  isActive ? 'nav-link-active' : 'nav-link'}>Абітурієнтам</NavLink>
          <NavLink to="/admin/categories/news" end className={({isActive }) =>  isActive ? 'nav-link-active' : 'nav-link'}>Новини</NavLink>
        </nav>
        <div className="right">
          <AdminAvatar/>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </AuthorizedRoute>);
}