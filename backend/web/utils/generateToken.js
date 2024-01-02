import jwt from 'jsonwebtoken'

const generateToken = (res, _id) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

  res.cookie('meowjwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV !== 'development' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export default generateToken