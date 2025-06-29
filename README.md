# Portfolio Backend

A Node.js backend service for handling email functionality in your portfolio website.

## Features

- ✅ Email sending via contact form
- ✅ Multiple email service support (Gmail, Outlook, Custom SMTP)
- ✅ Rate limiting to prevent spam
- ✅ CORS configuration for frontend integration
- ✅ Security middleware (Helmet)
- ✅ Input validation
- ✅ Beautiful HTML email templates
- ✅ Health check endpoint

## Setup

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your email settings:

```bash
cp env.example .env
```

Edit `.env` with your email credentials:

#### For Gmail (Recommended):
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Important for Gmail:**
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the App Password instead of your regular password

#### For Outlook/Hotmail:
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### For Custom SMTP:
```env
EMAIL_SERVICE=custom
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@your-domain.com
EMAIL_PASS=your-password
```

### 3. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Portfolio backend is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Send Email
```
POST /api/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Portfolio Inquiry",
  "message": "Hello! I'm interested in your work..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Email sent successfully!"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "All fields are required: name, email, subject, message"
}
```

## Frontend Integration

### React Example

```jsx
import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        required
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        required
      />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
      
      {status === 'success' && <p>Message sent successfully!</p>}
      {status === 'error' && <p>Failed to send message. Please try again.</p>}
    </form>
  );
};
```

## Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Input Validation**: Email format and required fields validation
- **CORS Protection**: Configured for your frontend domain
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data protection

## Deployment

### Heroku
1. Create a new Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git

### Vercel
1. Install Vercel CLI
2. Run `vercel` in the Backend directory
3. Set environment variables in Vercel dashboard

### Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

## Troubleshooting

### Email Not Sending
1. Check your email credentials in `.env`
2. For Gmail, ensure you're using an App Password
3. Check if your email provider allows SMTP access
4. Verify the email service configuration

### CORS Errors
1. Update `FRONTEND_URL` in `.env` to match your frontend URL
2. Ensure the frontend is making requests to the correct backend URL

### Rate Limiting
The API limits 5 requests per 15 minutes per IP. This prevents spam and abuse.

## License

MIT License 