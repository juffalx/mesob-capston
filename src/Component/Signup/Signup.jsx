import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { useAuth } from '../../context/AuthContext';

const PREFERENCES = [
  'All Heritage Delicacies',
  'Fasting & Vegan (Tsom)',
  'Halal Certified Meat',
  '100% Pure Teff (Gluten-Free)',
];

function Signup() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirm: '',
    pref: PREFERENCES[0],
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => {
    const val =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 3) er.name = 'Please enter your full name';
    if (!/^\d{9}$/.test(form.phone))
      er.phone = 'Enter a 9-digit mobile number (e.g., 912345678)';
    if (!form.email.includes('@')) er.email = 'Enter a valid email address';
    if (form.password.length < 8) er.password = 'Minimum 8 characters';
    if (form.confirm !== form.password) er.confirm = 'Passwords do not match';
    if (!form.terms) er.terms = 'You must agree to the Hospitality Terms';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setDone(true);
  
    login({ name: form.name, phone: form.phone, email: form.email });
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <main className="signup-page">
      <p className="crumbs">
        / Account / <b>Join the Mesob Family</b>
      </p>

      <div className="signup-grid">
        {/* left panel */}
        <aside className="signup-side">
          <span className="badge gold">🍷 · MEMBER CIRCLE</span>
          <h1>Become an Honored Table Guest</h1>
          <p className="side-copy">
            Immerse yourself in authentic highland hospitality, where every
            shared meal honors community, connection, and craft.
          </p>

          <div className="gift-card">
            <b>🍷 Welcome Gift: Pure Tej or Buna</b>
            <p>
              Enjoy a complimentary flask of house-fermented Tej (pure honey
              wine) or a personalized Je Buna coffee ceremony with your
              inaugural banquet booking.
            </p>
          </div>

          <ul className="perk-list">
            <li>
              🥇 <b>Communal Gursha Points</b>
              <span>
                Earn generous loyalty points redeemable for hand-poured pure
                Teff injera, prime Siga Tibs, and bespoke banquet upgrades.
              </span>
            </li>
            <li>
              🔔 <b>Fasting Calendar Alerts</b>
              <span>
                Timely seasonal notifications for Tsom fasting periods, Chef's
                Bayenetu spreads, and lenten specialties.
              </span>
            </li>
            <li>
              🛵 <b>Express Addis Delivery</b>
              <span>
                Save Bole, Kazanchis, Old Airport, or Sarbet drop-offs for fast
                clay-pot-temperature delivery straight to your doorstep.
              </span>
            </li>
            <li>
              🪑 <b>Priority Mesob Table Reservations</b>
              <span>
                Skip standard waitlists for weekend live Kirar acoustic sets and
                evening green-coffee roasting ceremonies.
              </span>
            </li>
          </ul>

          <p className="proverb">
            "Sharing from the same mesob is the ancient covenant of love and
            trust."
            <br />
            <b>— HABESHA PROVERB</b>
          </p>
        </aside>

        {/* right form */}
        <section className="signup-card">
          <h2>Create Your Mesob House Account</h2>
          <p className="auth-sub">
            Join our culinary heritage circle in less than a minute.
          </p>

          <div className="social-row">
            <button type="button" className="social-btn">
              💛 Telebirr Quick Sign
            </button>
            <button type="button" className="social-btn">
              🇬 Continue with Google
            </button>
          </div>
          <p className="divider">——— Or register with your details ———</p>

          {done ? (
            <p className="welcome-msg">
              🎉 Account created! Welcome to the table,{' '}
              {form.name.split(' ')[0]}. (demo)
            </p>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="field">
                <label>Full Name (ሙሉ ስም)</label>
                <input
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g. Mohammed, Mekbib"
                />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>

              <div className="field">
                <label>Ethiopian Mobile Number (ስልክ ቁጥር)</label>
                <div className="phone-wrap">
                  <span className="prefix">📱 +251</span>
                  <input
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="911 234 567"
                  />
                </div>
                {errors.phone && <span className="err">{errors.phone}</span>}
                <small className="hint">
                  We will send a 4-digit code to verify your Ethiopian mobile
                  number.
                </small>
              </div>

              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="guest@mesobhouse.com"
                />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>

              <div className="two">
                <div className="field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Minimum 8 characters"
                  />
                  {errors.password && (
                    <span className="err">{errors.password}</span>
                  )}
                  <small className="hint">
                    {form.password.length >= 8
                      ? '✓ 8+ chars'
                      : '· · · · · · · · 8+ chars'}
                  </small>
                </div>
                <div className="field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={set('confirm')}
                    placeholder="Repeat password"
                  />
                  {errors.confirm && (
                    <span className="err">{errors.confirm}</span>
                  )}
                </div>
              </div>

              <div className="field">
                <label>Primary Dining Preference (Optional)</label>
                <small className="hint" style={{ marginBottom: 8 }}>
                  Helps our chefs customize your banquet platters and fasting
                  recommendations.
                </small>
                <div className="pref-chips">
                  {PREFERENCES.map((p) => (
                    <button
                      type="button"
                      key={p}
                      className={form.pref === p ? 'chip active' : 'chip'}
                      onClick={() => setForm((f) => ({ ...f, pref: p }))}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <label className="terms-row">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={set('terms')}
                />
                <span>
                  I agree to the Mesob House Hospitality Terms and Privacy
                  Guidelines.
                </span>
              </label>
              {errors.terms && (
                <span
                  className="err"
                  style={{ display: 'block', marginBottom: 8 }}
                >
                  {errors.terms}
                </span>
              )}

              <button className="btn-red auth-submit" type="submit">
                Create Account & Receive Welcome Gursha →
              </button>
            </form>
          )}

          <p className="auth-switch">
            Already part of our dining family?{' '}
            <Link to="/login">
              <b>Sign in here</b>
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Signup;
