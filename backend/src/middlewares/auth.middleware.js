const jwt = require('jsonwebtoken')


const authMiddleware = (req, res, next) => {
  try {
    //-------OBTENER HEADER AUTHORIZATION--------------------
    const authHeader = req.headers.authorization;

    //-------VERIFICAR QUE EXISTE----------------------------
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    //FORMATO:
    //--------BEARER TOKEN-----------------------------------
    const token = authHeader.split(' ')[1];

    //--------VERIFICAR TOKEN--------------------------------
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    //-------GUARDAR USUARIO EN REQUEST----------------------
    req.user = decoded;

    next();

  }catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token Invalido'
    });
  }
};

module.exports = authMiddleware;