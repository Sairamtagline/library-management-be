exports.JWT = {
  SECRET: process.env.JWT_SECRET,
};

exports.USER_TYPE = {
  ADMIN:"ADMIN",
  USER: "USER"
}

exports.TRANSACTION_TYPE = {
  BORROW :"borrowed",
  RETURNED: "returned"
}