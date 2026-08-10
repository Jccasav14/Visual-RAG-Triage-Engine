export default () => ({
  port: parseInt(process.env.PORT || '3004', 10),
  sendgridKey: process.env.SENDGRID_API_KEY || 'SG.mock',
  posthogKey: process.env.POSTHOG_API_KEY || 'phc_mock',
});
