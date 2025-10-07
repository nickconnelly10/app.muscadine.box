import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '1rem'
        }}>404</h1>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#64748b',
          marginBottom: '1.5rem'
        }}>Page Not Found</h2>
        <p style={{
          fontSize: '1rem',
          color: '#94a3b8',
          marginBottom: '2rem'
        }}>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          backgroundColor: '#6366f1',
          color: '#ffffff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '600'
        }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}