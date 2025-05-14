const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const usersPath = path.join(__dirname, 'users.json');
const charactersPath = path.join(__dirname, 'characters.json');

// إعدادات Express
app.use(express.static('public'));
app.use(express.json());

// -------------------- تسجيل مستخدم جديد --------------------
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  fs.readFile(usersPath, 'utf-8', (err, data) => {
    let users = [];
    if (!err && data) users = JSON.parse(data);

    const exists = users.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    users.push({ name, email, password });

    fs.writeFile(usersPath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'حدث خطأ أثناء الحفظ' });
      }

      res.json({ message: 'تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.' });
    });
  });
});

// -------------------- تسجيل الدخول --------------------
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile(usersPath, 'utf-8', (err, data) => {
    if (err || !data) {
      return res.status(500).json({ message: 'خطأ في قراءة البيانات' });
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      res.json({ message: `مرحبًا ${user.name}! تم تسجيل الدخول بنجاح.` });
    } else {
      res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' });
    }
  });
});

// -------------------- الحصول على الشخصيات --------------------
app.get('/characters', (req, res) => {
  fs.readFile(charactersPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    res.json(data ? JSON.parse(data) : []);
  });
});

// -------------------- إضافة شخصية جديدة --------------------
app.post('/characters', (req, res) => {
  const newCharacter = req.body;

  fs.readFile(charactersPath, 'utf-8', (err, data) => {
    let characters = [];
    if (!err && data) characters = JSON.parse(data);

    characters.push(newCharacter);

    fs.writeFile(charactersPath, JSON.stringify(characters, null, 2), (err) => {
      if (err) return res.status(500).send('Error writing file');
      res.json({ success: true });
    });
  });
});

// -------------------- تشغيل السيرفر --------------------
app.listen(PORT, () => {
  console.log(`✅ السيرفر يعمل على: http://localhost:${PORT}`);
});
