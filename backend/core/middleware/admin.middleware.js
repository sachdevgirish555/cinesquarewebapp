const adminOnly = (req, res, next) => {
  const key = req.headers["x-admin-key"]

  if (key !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  next()
}

module.exports = adminOnly
