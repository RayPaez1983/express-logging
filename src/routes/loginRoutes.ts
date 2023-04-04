import { Router, Request, Response, NextFunction } from 'express';

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  }

  res.status(403);
  res.send('Not permitted');
}

const router = Router();

router.get('/login', (req: Request, res: Response) => {
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

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;

  if (email && password) {
    req.session = { loggedIn: true };
    res.redirect('/');
  } else {
    res.send('Por favor veirifique su correo');
  }
});

router.get('/', (req: Request, res: Response) => {
  if (req.session && req.session.loggedIn) {
    res.send(`
      <div>
        <div>Sesion iniciada</div>
        <a href="/logout">Cerrar sesion</a>
      </div>
    `);
  } else {
    res.send(`
      <div>
        <div>Sesion cerrada</div>
        <a href="/login">Iniciar sesion</a>
      </div>
    `);
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send('Welcome to protected route, logged in user');
});

export { router };
