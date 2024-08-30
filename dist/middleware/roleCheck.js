export const roleCheck = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (roles.includes(user.role)) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden: You do not have the necessary role' });
    };
};
//# sourceMappingURL=roleCheck.js.map