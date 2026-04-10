function sendSuccess(res, data = {}, status = 200, message) {
  const payload = { success: true, ...data };
  if (message) payload.message = message;
  return res.status(status).json(payload);
}

function sendError(res, error, status = 500, details) {
  const payload = { success: false, error };
  if (details) payload.details = details;
  return res.status(status).json(payload);
}

module.exports = { sendSuccess, sendError };
