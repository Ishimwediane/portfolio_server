import dotenv from 'dotenv';
import { testEmail } from './services/emailService.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing email functionality...\n');

// Check if environment variables are set
const requiredEnvVars = ['EMAIL_SERVICE', 'EMAIL_USER', 'EMAIL_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars.join(', '));
  console.log('\n📝 Please set up your .env file with the required variables.');
  console.log('💡 Copy env.example to .env and fill in your email credentials.');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`📧 Email service: ${process.env.EMAIL_SERVICE}`);
console.log(`👤 Email user: ${process.env.EMAIL_USER}`);
console.log('');

// Test email sending
testEmail(); 