import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CheckoutDelivery.css';
import ImgBox from '../UI/ImgBox';
import { useCart } from '../../context/CartContext';
import { fmt } from '../../data/dishes';

const EMPTY_FORM = {
  name: 'Mohammed Yasin',
  phone: '911457890',
  email: 'mame.b@example.com',
  subcity: 'Bole Medhanialem (Near Mesob House)',
  street: 'Behind Edna Mall, House No. 402, 3rd Floor',
  landmark: 'Opposite to Boston Day Spa, entrance through dark green gate',
  timing: 'immediate',
  scheduleTime: '7:30 PM',
  payment: 'telebirr',
  telebirrPhone: '0911457890',
};

function CheckoutDelivery() {
  const cart = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [placed, setPlaced] = useState(null); // order number when confirmed

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  // fake Telebirr verification — 900ms delay then a check mark
  const handleVerify = () => {
    if (!/^\d{9,10}$/.test(form.telebirrPhone)) {
      setErrors((er) => ({
        ...er,
        telebirrPhone: 'Enter a valid 9–10 digit Telebirr number',
      }));
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 900);
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Recipient name is required';
    if (!/^\d{9,10}$/.test(form.phone))
      er.phone = 'Enter a valid 9–10 digit mobile number';
    if (!form.email.includes('@'))
      er.email = 'Enter a valid email for the digital receipt';
    if (form.payment === 'telebirr' && !verified)
      er.payment = 'Please verify your Telebirr number first';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const confirmOrder = () => {
    if (!validate()) return;
    const orderNo = 'MH-' + Date.now().toString().slice(-6);
    cart.clearCart(); // basket becomes empty after ordering
    setPlaced(orderNo);
    window.scrollTo(0, 0);
  };

  if (placed) {
    return (
      <main className="checkout-page">
        <div className="confirm-box">
          <span className="confirm-icon">🧺</span>
          <h1>Order Confirmed — Ameseginalehu!</h1>
          <p className="order-no">
            Order <b>{placed}</b>
          </p>
          <p className="confirm-copy">
            Your clay pots are being sealed now. Estimated arrival:{' '}
            <b>35–45 minutes</b>
            from clay oven sealing, dispatched via the Direct Kitchen-to-Door
            Route. A dispatcher SMS is on its way to +251 {form.phone}.
          </p>
          <div className="confirm-actions">
            <Link to="/" className="btn-red" style={{ textDecoration: 'none' }}>
              Return to Today's Specials
            </Link>
            <Link
              to="/menu"
              className="btn-ghost"
              style={{ textDecoration: 'none' }}
            >
              Explore Full Menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-steps">
        <Link to="/orderCart" className="done">
          ✓ STEP 1 · Review Order
        </Link>
        <span className="current">2 · Delivery & Payment</span>
        <span className="todo">3 · Confirmation</span>
      </div>

      <div className="checkout-grid">
        <div className="checkout-forms">
          <div className="mode-pills">
            <span className="pill active">🛵 Prompt Delivery across Addis</span>
            <span className="pill">🍽 Dine-in Pickup (Bole)</span>
          </div>

          {/* 1. contact */}
          <section className="form-card">
            <h2>
              🪪 1. Contact & Guest Details{' '}
              <span className="mini-badge">Habesha Hospitality</span>
            </h2>
            <div className="two-col">
              <div className="field">
                <label>Recipient Name</label>
                <input value={form.name} onChange={set('name')} />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className="field">
                <label>Phone (Calls & Telegram SMS)</label>
                <div className="phone-wrap">
                  <span className="prefix">🇪🇹 +251</span>
                  <input value={form.phone} onChange={set('phone')} />
                </div>
                {errors.phone && <span className="err">{errors.phone}</span>}
              </div>
            </div>
            <div className="field">
              <label>Email for Digital Receipt</label>
              <input value={form.email} onChange={set('email')} />
              {errors.email && <span className="err">{errors.email}</span>}
            </div>
          </section>

          <section className="form-card">
            <h2>
              📍 2. Delivery Location in Addis Ababa{' '}
              <span className="mini-badge">♨ Insulated Mesob Carrier</span>
            </h2>
            <div className="two-col">
              <div className="field">
                <label>Sub-city / Neighborhood</label>
                <select value={form.subcity} onChange={set('subcity')}>
                  <option>Bole Medhanialem (Near Mesob House)</option>
                  <option>Kazanchis</option>
                  <option>Sarbet</option>
                  <option>Old Airport</option>
                  <option>CMC</option>
                </select>
              </div>
              <div className="field">
                <label>Street, Building, Flat No.</label>
                <input value={form.street} onChange={set('street')} />
              </div>
            </div>
            <div className="field">
              <label>Specific Landmark / Gate Instructions</label>
              <input value={form.landmark} onChange={set('landmark')} />
            </div>

            <div className="field">
              <label>Desired Dispatch Timing</label>
              <div className="timing-row">
                <label
                  className={
                    form.timing === 'immediate'
                      ? 'radio-card selected'
                      : 'radio-card'
                  }
                >
                  <input
                    type="radio"
                    checked={form.timing === 'immediate'}
                    onChange={() =>
                      setForm((f) => ({ ...f, timing: 'immediate' }))
                    }
                  />
                  <span>
                    <b>Immediate Dispatch</b>
                    <small>Fresh & hot off clay stove (~35–45 min)</small>
                  </span>
                </label>
                <label
                  className={
                    form.timing === 'schedule'
                      ? 'radio-card selected'
                      : 'radio-card'
                  }
                >
                  <input
                    type="radio"
                    checked={form.timing === 'schedule'}
                    onChange={() =>
                      setForm((f) => ({ ...f, timing: 'schedule' }))
                    }
                  />
                  <span>
                    <b>Schedule for Dinner</b>
                    <small>Set for evening feast (e.g., 7:30 PM)</small>
                  </span>
                </label>
              </div>
              {form.timing === 'schedule' && (
                <input
                  style={{ marginTop: 10, maxWidth: 220 }}
                  value={form.scheduleTime}
                  onChange={set('scheduleTime')}
                  placeholder="e.g., 7:30 PM"
                />
              )}
            </div>

            <div className="route-banner">
              🛵 <b>Direct Kitchen-to-Door Route</b>
              <small>Dispatched with heated earthen tray covers</small>
              <span>Bole Zone Priority</span>
            </div>
          </section>

          {/* 3. payment */}
          <section className="form-card">
            <h2>
              💳 3. Payment Method{' '}
              <span className="mini-badge">Encrypted & Direct</span>
            </h2>

            <label
              className={
                form.payment === 'telebirr'
                  ? 'radio-card selected'
                  : 'radio-card'
              }
            >
              <input
                type="radio"
                checked={form.payment === 'telebirr'}
                onChange={() => {
                  setForm((f) => ({ ...f, payment: 'telebirr' }));
                  setVerified(false);
                }}
              />
              <span className="pay-title">
                <b>Telebirr (ቴሌብር)</b>{' '}
                <span className="badge gold">Popular</span>
                <small>Instant SuperApp QR prompt or USSD confirmation</small>
              </span>
            </label>

            {form.payment === 'telebirr' && (
              <div className="telebirr-box">
                <p>
                  <b>Telebirr Quick Merchant Pay</b>
                </p>
                <p className="tb-sub">
                  Merchant ID: MESOB-7781. Enter your Telebirr registered phone
                  to authorize instant debit.
                </p>
                <div className="tb-row">
                  <input
                    value={form.telebirrPhone}
                    onChange={(e) => {
                      set('telebirrPhone')(e);
                      setVerified(false);
                    }}
                    placeholder="0911 234 567"
                  />
                  <button
                    className="btn-red"
                    onClick={handleVerify}
                    disabled={verifying || verified}
                  >
                    {verified
                      ? '✓ Verified'
                      : verifying
                        ? 'Verifying…'
                        : 'Verify'}
                  </button>
                </div>
                {errors.telebirrPhone && (
                  <span className="err">{errors.telebirrPhone}</span>
                )}
                {errors.payment && (
                  <span className="err">{errors.payment}</span>
                )}
              </div>
            )}

            {[
              {
                key: 'cbe',
                logo: 'CBE',
                name: 'CBE Birr / CBE Mobile Banking',
                sub: 'Direct settlement via Commercial Bank of Ethiopia',
              },
              {
                key: 'cash',
                logo: 'POS',
                name: 'Cash or Card on Delivery',
                sub: 'Rider delivers with wireless POS card terminal + change for cash',
              },
              {
                key: 'amole',
                logo: 'AB',
                name: 'Amole / Awash Birr',
                sub: 'Dashen Amole wallet or Awash Birr direct integration',
              },
            ].map((p) => (
              <label
                key={p.key}
                className={
                  form.payment === p.key ? 'radio-card selected' : 'radio-card'
                }
                style={{ marginTop: 10 }}
              >
                <input
                  type="radio"
                  checked={form.payment === p.key}
                  onChange={() => setForm((f) => ({ ...f, payment: p.key }))}
                />
                <span className="pay-logo">{p.logo}</span>
                <span>
                  <b>{p.name}</b>
                  <small>{p.sub}</small>
                </span>
              </label>
            ))}
          </section>

          <div className="promise">
            🍽 <b>The Mesob House Promise</b>
            <p>
              Every communal platter arrives with four extra folds of authentic
              100% pure teff injera, warm wet towels, and our hand-blended
              Mitmita spice on the side.
            </p>
          </div>
        </div>

        <aside className="summary">
          <p className="kicker">HABESHA FEAST</p>
          <div className="summary-head">
            <h2>Order Summary</h2>
            <Link to="/orderCart" className="link-btn">
              Edit Cart
            </Link>
          </div>

          {cart.items.map((i) => (
            <div className="summary-item" key={i.id + (i.option || '')}>
              <ImgBox
                label={i.name}
                style={{ minHeight: 54, width: 54, borderRadius: 8 }}
              />
              <div>
                <b>{i.name}</b>
                {i.option && <small>{i.option}</small>}
                <small>Qty: {i.qty}</small>
              </div>
              <b className="line-price">{fmt(i.lineTotal)}</b>
            </div>
          ))}

          <div className="deliver-to">
            <small>📍 DELIVERING TO · 🟢 Active Corridor</small>
            <b>{form.subcity.split(' (')[0]}, Edna Mall area</b>
            <span>Estimated arrival: ~35–45 mins from clay oven sealing</span>
          </div>

          <div className="ledger-line">
            <span>Items Subtotal</span>
            <b>{fmt(cart.subtotal)}</b>
          </div>
          <div className="ledger-line">
            <span>Express Delivery (Bole Radius) ⓘ</span>
            <b className={cart.delivery === 0 ? 'free' : ''}>
              {cart.delivery === 0 ? 'FREE' : fmt(cart.delivery)}
            </b>
          </div>
          <div className="ledger-line">
            <span>Complimentary Injera (4 Rolls)</span>
            <b>INCLUDED</b>
          </div>
          <div className="ledger-line">
            <span>Clay Stew Thermal Packaging</span>
            <b>{cart.packaging === 0 ? 'FREE' : fmt(cart.packaging)}</b>
          </div>
          <div className="ledger-line">
            <span>City VAT (15%)</span>
            <b>{fmt(cart.vat)}</b>
          </div>
          {cart.coupon && (
            <div className="ledger-line">
              <span>🎟 {cart.coupon}</span>
              <b>− {fmt(cart.discount)}</b>
            </div>
          )}

          <div className="grand-row">
            <div>
              <small>TOTAL AMOUNT DUE</small>
              <b>Grand Total</b>
            </div>
            <b className="grand">{fmt(cart.grand)}</b>
          </div>
          <small className="tax-note">VAT Inclusive</small>

          <p className="guarantee">
            🛡 Guaranteed steaming hot in woven sealed carriers or 100% remade.
          </p>

          <button className="btn-red confirm-btn" onClick={confirmOrder}>
            🧾 Confirm Order & Pay {fmt(cart.grand)}
          </button>
          <div className="summary-links">
            <Link to="/orderCart">← Return to Cart</Link>
            <Link to="/menu">Add More Dishes</Link>
          </div>

          <div className="support-card">
            <span>🎧</span>
            <div>
              <b>Need Phone Support?</b>
              <small>Direct kitchen desk: +251 911 234 567</small>
            </div>
            <button className="btn-ghost">Call Now</button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default CheckoutDelivery;
