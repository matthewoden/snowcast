export const response = (status, message) => {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
    })
  }
}
