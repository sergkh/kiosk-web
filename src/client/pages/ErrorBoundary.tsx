import * as React from 'react';
import { NavLink, useRouteError } from 'react-router';

function ErrorBoundary() {
  let error = useRouteError();
  
  console.error(error);
    
  return <div className="site-error">
    ⚠️ Сталась помилка. <NavLink to="/">Повернутись на головну сторінку →</NavLink> 
  </div>;
}

export default ErrorBoundary;