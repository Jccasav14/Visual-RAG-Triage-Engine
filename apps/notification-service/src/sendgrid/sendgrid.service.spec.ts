import { SendGridService } from './sendgrid.service';

describe('SendGridService', () => {
  it('should send email successfully', async () => {
    const service = new SendGridService();
    const res = await service.sendEmail('test@local.com', 'Subject', 'Body');
    expect(res.success).toBe(true);
  });
});
