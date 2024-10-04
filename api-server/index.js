// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());

const corsOptions = {
    origin: '*', // 
    optionsSuccessStatus: 200,
    credentials: true 
  };
  
  app.use(cors(corsOptions));

// 秘密鍵（JWTの署名用）
const SECRET_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxx';

// ユーザーデータ（デモ用にハードコーディング）
const users = [
  { username: 'gorin', password: '2023' },
  { username: 'gorin2', password: '2023' },
  { username: 'gorin3', password: '2023' },
];

// トークンのブラックリスト（ログアウト時に使用）
let tokenBlacklist = [];

// 結果データの保存用
let results = [];

// 認証ミドルウェア
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: '認証失敗' });

  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ success: false, message: '認証失敗' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ success: false, message: '認証失敗' });
    req.user = user;
    next();
  });
}

// ログインAPI
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '指定パラメータ不足' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: '認証失敗' });
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token, username: user.username });
});

// ログアウトAPI
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // トークンをブラックリストに追加
  tokenBlacklist.push(token);

  res.json({ success: true });
});

// フィールド取得API
app.get('/api/fields', authenticateToken, (req, res) => {
  const fieldData = {
    objects: [
      [1, 1, 1, 1, 1],
      [1, 2, 3, 0, 1],
      [1, 3, 0, 4, 1],
      [1, 1, 1, 1, 1],
    ],
  };

  res.json(fieldData);
});

// 結果一覧API
app.get('/api/results', authenticateToken, (req, res) => {
  res.json(results);
});

// 結果投稿API
app.post('/api/results', authenticateToken, (req, res) => {
  const { block_moves, time } = req.body;

  if (block_moves == null || time == null) {
    return res.status(400).json({ success: false, message: '指定パラメータ不足' });
  }

  results.push({
    user: req.user.username,
    block_moves,
    time,
  });

  res.status(201).json({ success: true });
});

// サーバーの起動
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
