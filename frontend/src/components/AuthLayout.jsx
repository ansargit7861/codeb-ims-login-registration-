import './AuthLayout.css';

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-panel">
        <div className="auth-panel-top">
          <div className="brand-mark">Code-B</div>
          <div className="brand-name">MIS &amp; Invoicing System</div>
        </div>

        <div className="auth-panel-copy">
          <h1>Every estimate, invoice and payment, tracked in one ledger.</h1>
          <p>
            Built for the sales team to manage clients, chains and brands —
            and turn estimates into paid invoices without the spreadsheet chaos.
          </p>
        </div>

        <svg className="ledger-art" viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="30" x2="340" y2="30" stroke="#3A4A73" strokeWidth="1"/>
          <line x1="20" y1="70" x2="260" y2="70" stroke="#3A4A73" strokeWidth="1"/>
          <line x1="20" y1="110" x2="300" y2="110" stroke="#3A4A73" strokeWidth="1"/>
          <line x1="20" y1="150" x2="220" y2="150" stroke="#3A4A73" strokeWidth="1"/>
          <circle cx="335" cy="150" r="5" fill="#4C9A78"/>
          <line x1="20" y1="190" x2="280" y2="190" stroke="#3A4A73" strokeWidth="1"/>
        </svg>

        <div className="auth-panel-foot">Sales · Estimates · Invoices · Payments</div>
      </aside>

      <main className="auth-form-side">
        <div className="auth-form-wrap">
          {eyebrow && <span className="auth-eyebrow">{eyebrow}</span>}
          <h2 className="auth-title">{title}</h2>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}
