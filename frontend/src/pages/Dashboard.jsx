import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const NAV_ITEMS = [
  { label: 'Dashboard', roles: ['ADMIN', 'SALES'] },
  { label: 'Clients', roles: ['ADMIN', 'SALES'] },
  { label: 'Estimates', roles: ['ADMIN', 'SALES'] },
  { label: 'Invoices', roles: ['ADMIN', 'SALES'] },
  { label: 'Payments', roles: ['ADMIN', 'SALES'] },
  { label: 'Users', roles: ['ADMIN'] },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const initials = (user?.fullName || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-brand">Code-B IMS</div>
        <nav className="dash-nav">
          {NAV_ITEMS.filter((item) => item.roles.includes(user?.role)).map((item, idx) => (
            <a key={item.label} className={idx === 0 ? 'active' : ''} href="#">
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <div>
            <h2>Welcome back, {user?.fullName?.split(' ')[0]}</h2>
            <span className="dash-role-badge">{user?.role === 'ADMIN' ? 'Administrator' : 'Sales'}</span>
          </div>
          <div className="dash-user">
            <div className="dash-avatar">{initials}</div>
            <div className="dash-user-meta">
              <strong>{user?.fullName}</strong>
              <span>{user?.email}</span>
            </div>
            <button className="dash-logout" onClick={() => logout()}>Log out</button>
          </div>
        </header>

        <main className="dash-content">
          <section className="dash-hero-card">
            <span className="dash-hero-label">Open invoices this month</span>
            <div className="dash-hero-value">₹0.00</div>
            <p className="dash-hero-note">
              Invoicing functionality unlocks once the Estimates and Invoice modules are implemented
              in the next stage of the internship.
            </p>
          </section>

          <section className="dash-list-card">
            <h3>Quick overview</h3>
            <ul>
              <li>
                <span>Active clients</span>
                <strong>—</strong>
              </li>
              <li>
                <span>Pending estimates</span>
                <strong>—</strong>
              </li>
              <li>
                <span>Payments received</span>
                <strong>—</strong>
              </li>
              {user?.role === 'ADMIN' && (
                <li>
                  <span>Registered users</span>
                  <strong>—</strong>
                </li>
              )}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
