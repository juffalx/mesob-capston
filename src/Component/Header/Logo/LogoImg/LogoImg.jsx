import './LogoImg.css';
function LogoImg() {
  return (
    <div className="logo-img">
      <img
        src={`${import.meta.env.BASE_URL}asset/logo.png`}
        alt="Mesob House"
      />
      {/* Mesob House Brand Logo */}
    </div>
  );
}

export default LogoImg;
