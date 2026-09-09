const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Free*1122';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'elias-bet-change-this-secret';

app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: false }));

const DB_FILE = path.join(__dirname, 'data.json');

const defaultGames = [
  {
    "id": 1,
    "title": "Royal Slots",
    "icon": "🎰",
    "description": "Animated 5-reel slot machine.",
    "reward": 100,
    "enabled": true,
    "gameType": "slots"
  },
  {
    "id": 2,
    "title": "European Roulette",
    "icon": "🎡",
    "description": "Spin the roulette wheel and pick a number or color.",
    "reward": 100,
    "enabled": true,
    "gameType": "roulette"
  },
  {
    "id": 3,
    "title": "Blackjack 21",
    "icon": "🃏",
    "description": "Deal cards and try to beat the dealer.",
    "reward": 100,
    "enabled": true,
    "gameType": "blackjack"
  },
  {
    "id": 4,
    "title": "Baccarat",
    "icon": "♠️",
    "description": "Choose Player, Banker or Tie in a baccarat table.",
    "reward": 100,
    "enabled": true,
    "gameType": "baccarat"
  },
  {
    "id": 5,
    "title": "Video Poker",
    "icon": "🃏",
    "description": "Deal a five-card poker hand.",
    "reward": 100,
    "enabled": true,
    "gameType": "videopoker"
  },
  {
    "id": 6,
    "title": "Craps Dice",
    "icon": "🎲",
    "description": "Roll the dice table.",
    "reward": 100,
    "enabled": true,
    "gameType": "craps"
  },
  {
    "id": 7,
    "title": "Sic Bo",
    "icon": "🎲",
    "description": "Predict a three-dice result.",
    "reward": 100,
    "enabled": true,
    "gameType": "sicbo"
  },
  {
    "id": 8,
    "title": "Hi-Lo Cards",
    "icon": "🔺",
    "description": "Guess whether the next card is higher or lower.",
    "reward": 100,
    "enabled": true,
    "gameType": "hilo"
  },
  {
    "id": 9,
    "title": "Dragon Tiger",
    "icon": "🐉",
    "description": "Pick Dragon, Tiger or Tie.",
    "reward": 100,
    "enabled": true,
    "gameType": "dragontiger"
  },
  {
    "id": 10,
    "title": "Andar Bahar",
    "icon": "🂡",
    "description": "Choose the side for the matching-card game.",
    "reward": 100,
    "enabled": true,
    "gameType": "andarbahar"
  },
  {
    "id": 11,
    "title": "Teen Patti",
    "icon": "♣️",
    "description": "Virtual three-card hand comparison.",
    "reward": 100,
    "enabled": true,
    "gameType": "teenpatti"
  },
  {
    "id": 12,
    "title": "Lucky 7",
    "icon": "7️⃣",
    "description": "Pick a virtual lucky seven result.",
    "reward": 100,
    "enabled": true,
    "gameType": "lucky7"
  },
  {
    "id": 13,
    "title": "Wheel of Fortune",
    "icon": "🎡",
    "description": "Animated prize wheel with credits.",
    "reward": 100,
    "enabled": true,
    "gameType": "wheel"
  },
  {
    "id": 14,
    "title": "Plinko Casino",
    "icon": "🔴",
    "description": "Drop a virtual chip through a Plinko board.",
    "reward": 100,
    "enabled": true,
    "gameType": "plinko"
  },
  {
    "id": 15,
    "title": "Keno 10",
    "icon": "🔢",
    "description": "Pick numbers and reveal virtual draws.",
    "reward": 100,
    "enabled": true,
    "gameType": "keno"
  },
  {
    "id": 16,
    "title": "Bingo Room",
    "icon": "🎟️",
    "description": "Virtual bingo draw with animated balls.",
    "reward": 100,
    "enabled": true,
    "gameType": "bingo"
  },
  {
    "id": 17,
    "title": "Coin Casino",
    "icon": "🪙",
    "description": "Animated heads or tails table.",
    "reward": 100,
    "enabled": true,
    "gameType": "coin"
  },
  {
    "id": 18,
    "title": "Red & Black",
    "icon": "♦️",
    "description": "Pick the color of the next card.",
    "reward": 100,
    "enabled": true,
    "gameType": "colorcard"
  },
  {
    "id": 19,
    "title": "High Card",
    "icon": "♠️",
    "description": "Draw against the virtual dealer.",
    "reward": 100,
    "enabled": true,
    "gameType": "highcard"
  },
  {
    "id": 20,
    "title": "War Table",
    "icon": "⚔️",
    "description": "Fast card battle.",
    "reward": 100,
    "enabled": true,
    "gameType": "war"
  },
  {
    "id": 21,
    "title": "Lucky Gems",
    "icon": "💎",
    "description": "Pick a gem from the animated vault.",
    "reward": 100,
    "enabled": true,
    "gameType": "gems"
  },
  {
    "id": 22,
    "title": "Treasure Vault",
    "icon": "💰",
    "description": "Choose one of three virtual vaults.",
    "reward": 100,
    "enabled": true,
    "gameType": "vault"
  },
  {
    "id": 23,
    "title": "Lucky 3",
    "icon": "🍀",
    "description": "Pick one of three lucky doors.",
    "reward": 100,
    "enabled": true,
    "gameType": "lucky3"
  },
  {
    "id": 24,
    "title": "Jackpot Wheel",
    "icon": "🏆",
    "description": "Animated jackpot wheel for credits.",
    "reward": 100,
    "enabled": true,
    "gameType": "jackpot"
  },
  {
    "id": 25,
    "title": "3D Neon Spin",
    "icon": "🎰",
    "description": "Immersive 3D virtual casino wheel with animated neon effects.",
    "reward": 100,
    "enabled": true,
    "gameType": "3d"
  },
  {
    "id": 26,
    "title": "3D Crash Airplane",
    "icon": "✈️",
    "description": "3D virtual airplane flight with rising multiplier and crash animation.",
    "reward": 100,
    "enabled": true,
    "gameType": "crash3d"
  }
];

function freshDB() {
  return {
    games: defaultGames,
    users: [],
    deposits: [],
    withdrawals: [],
    transactions: [],
    settings: {
      depositNumbers: { bKash: '', Nagad: '', Rocket: '' },
      withdrawNumbers: { bKash: '', Nagad: '', Rocket: '' }
    }
  };
}

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const d = freshDB();
      fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2));
      return d;
    }
    const d = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const base = freshDB();
    return {
      ...base,
      ...d,
      settings: { ...base.settings, ...(d.settings || {}) }
    };
  } catch (e) {
    console.error('DB read error:', e);
    return freshDB();
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function sign(value) {
  return crypto.createHmac('sha256', ADMIN_SECRET).update(value).digest('hex');
}

function makeToken() {
  const payload = Buffer.from(JSON.stringify({
    u: ADMIN_USER,
    exp: Date.now() + 12 * 60 * 60 * 1000
  })).toString('base64url');
  return payload + '.' + sign(payload);
}

function validToken(req) {
  const auth = req.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token || !token.includes('.')) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = sign(payload);
  if (signature.length !== expected.length) return false;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
    const p = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return p.u === ADMIN_USER && p.exp > Date.now();
  } catch {
    return false;
  }
}

function json(res, body, status = 200) {
  return res.status(status).json(body);
}

app.get('/api/health', (req, res) => json(res, { ok: true, service: 'elias-bet-backend' }));

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return json(res, { error: 'Invalid admin login' }, 401);
  }
  return json(res, { ok: true, token: makeToken() });
});

app.post('/api/admin/logout', (req, res) => json(res, { ok: true }));

app.get('/api/public', (req, res) => {
  const d = readDB();
  return json(res, { games: d.games.filter(g => g.enabled !== false), settings: d.settings });
});

app.get('/api/games', (req, res) => {
  const d = readDB();
  return json(res, { games: d.games });
});

app.get('/api/settings', (req, res) => {
  const d = readDB();
  return json(res, { settings: d.settings });
});

function requireAdmin(req, res, next) {
  if (!validToken(req)) return json(res, { error: 'Unauthorized' }, 401);
  next();
}

app.get('/api/data', requireAdmin, (req, res) => json(res, readDB()));

app.put('/api/data', requireAdmin, (req, res) => {
  const old = readDB();
  const body = req.body || {};
  const next = {
    ...old,
    ...body,
    settings: { ...old.settings, ...(body.settings || {}) }
  };
  writeDB(next);
  return json(res, { ok: true, data: next });
});

app.put('/api/games', requireAdmin, (req, res) => {
  const d = readDB();
  d.games = Array.isArray(req.body?.games) ? req.body.games : [];
  writeDB(d);
  return json(res, { ok: true, games: d.games });
});

app.put('/api/settings', requireAdmin, (req, res) => {
  const d = readDB();
  d.settings = { ...d.settings, ...(req.body?.settings || {}) };
  writeDB(d);
  return json(res, { ok: true, settings: d.settings });
});

// Serve the public website and standalone admin panel.
app.use(express.static(__dirname, { index: 'index.html' }));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ELIAS BET server running on port ${PORT}`);
});
