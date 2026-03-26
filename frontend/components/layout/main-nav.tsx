import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/sales', label: 'Sales' },
  { href: '/sales/new', label: 'Create Sale' },
  { href: '/evaluations', label: 'Evaluations' }
];

export function MainNav() {
  return (
    <header className="main-nav">
      <div className="main-nav-inner">
        <strong>Sales Eval App</strong>

        <nav className="main-nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
