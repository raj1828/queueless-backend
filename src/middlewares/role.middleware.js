export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
};

export const roleCheck = (...allowRoles) => {
  return (req, res, next) => {
    if(!req.user || !req.user.role){
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if(!allowRoles.includes(req.user.role)){
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action"
      });
    }

    next();
  }

}