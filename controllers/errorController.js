
exports.triggerError = (req, res, next) => {
  next(new Error('🚨 Intentional 500 error for testing'));
};
