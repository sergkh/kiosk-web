import * as React from 'react';
import { NavLink, useNavigate, useRouteError } from 'react-router';

function ErrorBoundary({url} : {url?: string}) {
  let error = useRouteError();
  
  console.error(error);
    
  return <div className="site-error">
    ⚠️ Сталась помилка. <NavLink to={url ?? '/'}>Повернутись →</NavLink> 
  </div>;
}

export default ErrorBoundary;