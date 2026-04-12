export const getHealth = (_request, response) => {
  response.json({
    ok: true,
    service: 'volunteerhub-server',
    timestamp: new Date().toISOString(),
  });
};
