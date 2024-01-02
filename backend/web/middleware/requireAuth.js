import User from '../../models/userModel.js'

import jwt from 'jsonwebtoken'

const requireAuth = async (req, res, next) => {
  if (!req.cookies.meowjwt) return res.status(401).json({
    error: 'Unauthorized request',
    code: 401
  })

  const token = req.cookies.meowjwt

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findOne({ _id }).select('_id')
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({error: 'Unauthorized request'})
  }
}

export default requireAuth