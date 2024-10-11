// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));

// 秘密鍵（JWTの署名用）
const SECRET_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxx';

// ユーザーデータ（デモ用にハードコーディング）
let users = [
  { username: 'gorin', password: '2023', nickname: 'Gorin' },
  { username: 'gorin2', password: '2023', nickname: 'Gorin2' },
  { username: 'gorin3', password: '2023', nickname: 'Gorin3' },
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
  console.log(user)
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

// プロフィール取得API
app.get('/api/profile', authenticateToken, (req, res) => {
  console.log(req)
  const user = users.find(u => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ success: false, message: 'ユーザーが見つかりません' });
  }

  res.json({ success: true, profile: { username: user.username, nickname: user.nickname } });
});

// プロフィール更新API
app.put('/api/profile', authenticateToken, (req, res) => {
  const { username, nickname } = req.body;

  // バリデーション
  const usernamePattern = /^[a-zA-Z0-9]{5,}$/;
  if (!username || !usernamePattern.test(username)) {
    return res.status(400).json({ success: false, message: 'ユーザーネームは必須で、5文字以上かつa-z/A-Z/0-9のみ使用可能です' });
  }

  if (!nickname || nickname.length < 4) {
    return res.status(400).json({ success: false, message: 'ニックネームは必須で、4文字以上である必要があります' });
  }

  // ユーザーネームの重複チェック
  const existingUser = users.find(u => u.username === username && u.username !== req.user.username);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'The username is already taken.' });
  }

  // プロフィール更新
  const user = users.find(u => u.username === req.user.username);
  if (user) {
    user.username = username;
    user.nickname = nickname;

    // 新しいトークンを発行
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    return res.json({ success: true, message: 'プロフィールが更新されました', token });
  }

  res.status(404).json({ success: false, message: 'ユーザーが見つかりません' });
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
const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
