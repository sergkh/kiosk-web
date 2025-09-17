import { NavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './TopNav.css';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export type MenuItem = {
  path: string;
  icon: IconProp;
  label: string;
}

export type TopNavProps = {
  items: MenuItem[];
  className?: string;
}

function TopNav({items, className = ''}: TopNavProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const activeIndex = items.findIndex(item => location.pathname === item.path);

  return (
    <nav className={"top-nav" + (className ? ` ${className}` : '')}>
      <ul>
        {
          items.map((item, index) => (
            <li key={item.path} className={activeIndex === index ? 'active' : ''}>
              <NavLink to={item.path}>
                <FontAwesomeIcon icon={item.icon} />
                {t(item.label)}
              </NavLink>
            </li>
          ))
        }
      </ul>
      {
        activeIndex != -1 ? <span className="glider" style={{transform: `translateX(${activeIndex * 100}%)`}} /> : <></>
      }
    </nav>
  );
}

export default TopNav;

