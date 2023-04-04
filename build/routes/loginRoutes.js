"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
function requireAuth(req, res, next) {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }
    res.status(403);
    res.send('Not permitted');
}
const router = (0, express_1.Router)();
exports.router = router;
router.get('/login', (req, res) => {
    res.send(`
    <form method="POST">
      <div>
        <label>Correo Electronico</label>
        <input name="email" />
      </div>
      <div>
        <label>Clave</label>
        <input name="password" type="password" />
      </div>
      <button>Enviar</button>
    </form>
  `);
});
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        req.session = { loggedIn: true };
        res.redirect('/');
    }
    else {
        res.send('Por favor veirifique su correo');
    }
});
router.get('/', (req, res) => {
    if (req.session && req.session.loggedIn) {
        res.send(`
      <div>
        <div>Sesion iniciada</div>
        <a href="/logout">Cerrar sesion</a>
      </div>
    `);
    }
    else {
        res.send(`
      <div>
        <div>Sesion cerrada</div>
        <a href="/login">Iniciar sesion</a>
      </div>
    `);
    }
});
router.get('/logout', (req, res) => {
    req.session = undefined;
    res.redirect('/');
});
router.get('/protected', requireAuth, (req, res) => {
    res.send('Bienvenido al area protegida');
});
