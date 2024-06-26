const User = require('../models/user')
const middleware = require('../middleware/index')
// Error handling function (DRY )
const errorsCatch = (err, res) => {
  console.error(err)
  console.log('Error message:', err.message) // Log the error message for debugging
  res.status(500).render('error', { error: 'An error occurred' })
}
//register a user
const add = async (req, res) => {
  try {
    const newUser = req.body
    const existEmail = await User.findOne({ email: newUser.email })
    if (existEmail) {
      return res.status(409).send('Email already exists')
    }
    let passwordDigest = await middleware.hashPassword(newUser.password)
    const user = new User({
      userName: newUser.userName,
      email: newUser.email,
      passwordDigest
    })
    const savedUser = await user.save()
    console.log(`user added successfully: ${savedUser._id}`)
    return res.status(201).send('user have been added')
  } catch (error) {
    console.error('Error adding user:', error)
    res.status(500).send('Error adding user')
  }
}
//user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    let matched = await middleware.comparePassword(
      user.passwordDigest,
      password
    )
    if (matched) {
      let payload = {
        id: user.id,
        email: user.email
      }
      let token = middleware.createToken(payload)
      return res.send({ user: payload, token })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: 'Error', msg: 'An error has occurred!' })
  }
}
// Update(Edit a user details using form)
const edit = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      console.log('User not found:', userId)
      return res.status(404).render('error', { error: 'User not found' })
    }
    console.log('User details for editing:', user)
    res.render(`editUser`, { user })
  } catch (err) {
    errorsCatch(err, res)
  }
}

// Display user profile
const show = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      console.log('User not found:', userId)
      return res.status(404).render('error', { error: 'User not found' })
    }
    console.log('User profile:', user)
  } catch (err) {
    errorsCatch(err, res)
  }
}

const update = async (req, res) => {
  try {
    const userId = req.params.id
    const updateData = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
        ? await bcrypt.hash(
            req.body.password,
            parseInt(process.env.SALT_ROUNDS)
          )
        : undefined
    }
    if (req.file) {
      updateData.image = req.file.path
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true
    })
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' })
  }
}

// Soft-delete (deactivates user insted of removing it from the DB)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id
    const deactivatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    )
    if (!deactivatedUser) {
      console.log('User not found:', userId)
      return res.status(404).render('error', { error: 'User not found' })
    }
    console.log('User deactivated successfully:', deactivatedUser)
  } catch (err) {
    errorsCatch(err, res)
  }
}
module.exports = {
  login,
  edit,
  update,
  show,
  remove: deleteUser,
  create: add
}
