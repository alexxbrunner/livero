import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Mailchimp configuration
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || 'us1'; // e.g., us1, us2, etc.
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID || '';

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, firstName, lastName, language } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check if Mailchimp is configured
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
      console.warn('Mailchimp not configured. Email would be:', email);
      // For development, just return success
      return res.json({ 
        success: true, 
        message: 'Newsletter subscription received (Mailchimp not configured)' 
      });
    }

    // Mailchimp API endpoint
    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

    // Prepare member data
    const memberData: any = {
      email_address: email,
      status: 'subscribed', // or 'pending' for double opt-in
      tags: ['Livero', 'Website'],
    };

    // Add merge fields if provided
    if (firstName || lastName) {
      memberData.merge_fields = {
        ...(firstName && { FNAME: firstName }),
        ...(lastName && { LNAME: lastName }),
      };
    }

    // Add language if provided
    if (language) {
      memberData.language = language;
    }

    // Send to Mailchimp
    const response = await axios.post(url, memberData, {
      auth: {
        username: 'anystring', // Mailchimp uses 'anystring' as username
        password: MAILCHIMP_API_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      mailchimpId: response.data.id,
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error.response?.data || error.message);

    // Handle specific Mailchimp errors
    if (error.response?.data) {
      const mailchimpError = error.response.data;
      
      // Member already exists
      if (mailchimpError.title === 'Member Exists') {
        return res.status(400).json({ 
          error: 'This email is already subscribed to our newsletter' 
        });
      }

      // Invalid email
      if (mailchimpError.title === 'Invalid Resource') {
        return res.status(400).json({ 
          error: 'Please provide a valid email address' 
        });
      }

      // Other Mailchimp errors
      return res.status(400).json({ 
        error: mailchimpError.detail || 'Failed to subscribe to newsletter' 
      });
    }

    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID) {
      return res.json({ 
        success: true, 
        message: 'Unsubscribe request received (Mailchimp not configured)' 
      });
    }

    // Create MD5 hash of lowercase email for Mailchimp subscriber hash
    const crypto = require('crypto');
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${subscriberHash}`;

    await axios.patch(
      url,
      { status: 'unsubscribed' },
      {
        auth: {
          username: 'anystring',
          password: MAILCHIMP_API_KEY,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed from newsletter' 
    });
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to unsubscribe from newsletter' });
  }
});

export default router;

