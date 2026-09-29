import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import '../components/forms.css';

export default function VerifyEmail() {
  const { verifyEmail } = useAuth();
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('Verifying your email…');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('This verification link is missing its token.');
      return;
    }
    verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'This verification link is invalid or has expired.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthLayout eyebrow="Account verification" title="Verifying your email">
      <div className={`alert ${status === 'error' ? 'alert-error' : 'alert-success'}`}>{message}</div>
      <p className="auth-alt-action">
        <Link to="/login">Go to log in</Link>
      </p>
    </AuthLayout>
  );
}
