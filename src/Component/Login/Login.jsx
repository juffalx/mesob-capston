import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import ImgBox from '../../Component/UI/ImgBox';
import { useAuth } from '../../context/AuthContext';
import loginImg from './LoginImage.png';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [welcome, setWelcome] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{9,10}$/.test(phone))
      return setError('Enter a valid 9–10 digit Ethiopian mobile number.');
    if (password.length < 4)
      return setError('Password must be at least 4 characters.');
    setError('');

    login({ phone });
    setWelcome('Selam! You are signed in (demo — no real backend yet).');
    setTimeout(() => navigate('/'), 700);
  };

  return (
    <main className="auth-page">
      <p className="crumbs">
        HOME / ACCOUNT / <b>SIGN IN</b>
      </p>

      <div className="auth-grid">
        <aside className="auth-side">
          <span className="badge gold">MESOB FEAST CIRCLE & PERKS</span>
          <h1>
            A table shared is a <em>bond celebrated.</em>
          </h1>
          <p className="auth-copy">
            Sign into your culinary sanctuary. Track your seasonal fasting
            platters, express your Je Buna preferences, and summon traditional
            Addis feasts straight to your door.
          </p>

          <div className="side-img-wrap">
            <img
              src={loginImg}
              alt="Sunday Je Buna Buna Circle"
              style={{ minHeight: 180 }}
            />
            <span className="side-img-tag">
              Sunday Je Buna Circle · Exclusive roasting access for verified
              members
            </span>
          </div>

          <ul className="perk-list">
            <li>
              𫚔 <b>10 Gursha Points / ETB 100</b>
              <span>
                Redeem against rare honey tej batches or special communal
                platters.
              </span>
            </li>
            <li>
              🛵 <b>Free Bole & Kazanchis Delivery</b>
              <span>
                Priority courier dispatch with heat-insulated clay-stone trays.
              </span>
            </li>
            <li>
              🧾 <b>Instant Telebirr & CBE Birr</b>
              <span>
                Zero-fee instant table settlement and 1-tap reordering.
              </span>
            </li>
          </ul>

          <p className="quote">
            "The table ordering is as seamless as eating from our grandmother's
            mesob."
            <br />
            <b>DR. SELAMAWIT H. — BOLE MEMBER</b>
          </p>
        </aside>

        <section className="auth-card">
          <p className="kicker">MEMBER PORTAL</p>
          <h2>Welcome to the Mesob Table</h2>
          <p className="auth-sub">
            Sign in to manage your feasts, Telebirr rewards, and reserved dining
            mesobs.
          </p>

          <div className="social-row">
            <button type="button" className="social-btn">
              💛 Telebirr SuperApp →
            </button>
            <button type="button" className="social-btn">
              🇬 Continue with Google →
            </button>
          </div>
          <p className="divider">——— OR WITH PHONE / EMAIL ———</p>

          {welcome ? (
            <p className="welcome-msg">{welcome}</p>
          ) : (
            <form onSubmit={submit}>
              <div className="field">
                <label>
                  Ethiopian Mobile Number{' '}
                  <span style={{ float: 'right', textTransform: 'none' }}>
                    SMS OTP Supported
                  </span>
                </label>
                <div className="phone-wrap">
                  <span className="prefix">🇪🇹 +251</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="091 123 4567"
                  />
                </div>
              </div>
              <div className="field">
                <label>
                  Password{' '}
                  <Link
                    to="/login"
                    style={{ float: 'right', textTransform: 'none' }}
                  >
                    Forgot Password?
                  </Link>
                </label>
                <div className="phone-wrap">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your confidential password"
                    style={{ borderRadius: '10px 0 0 10px' }}
                  />
                  <button
                    type="button"
                    className="prefix eye"
                    onClick={() => setShowPw((s) => !s)}
                  >
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="check-row">
                <label>
                  <input type="checkbox" /> Keep me signed in on this device
                </label>
                <label>
                  <input type="checkbox" /> Remember Addis address
                </label>
              </div>

              {error && (
                <p className="err" style={{ marginBottom: 10 }}>
                  {error}
                </p>
              )}
              <button className="btn-red auth-submit" type="submit">
                Sign In to Mesob House →
              </button>
            </form>
          )}

          <div className="auth-foot">
            <p>
              New to our dining family?
              <br />
              <Link to="/signup">
                <b>Join the Mesob Table & Register ›</b>
              </Link>
            </p>
            <Link to="/menu" className="btn-ghost">
              Continue as Guest
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
