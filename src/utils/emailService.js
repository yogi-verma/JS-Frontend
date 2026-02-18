import emailjs from '@emailjs/browser';

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Initialize EmailJS
 */
export const initEmailJS = () => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
};

/**
 * Send verification email using EmailJS
 * @param {string} toEmail - Recipient email address
 * @param {string} verificationCode - The verification code
 * @param {string} userName - User's display name
 * @returns {Promise} EmailJS response
 */
export const sendVerificationEmail = async (toEmail, verificationCode, userName = 'User') => {
    try {
        // Validate inputs
        if (!toEmail || !toEmail.trim()) {
            throw new Error('Recipient email is required');
        }

        if (!verificationCode) {
            throw new Error('Verification code is required');
        }

        const templateParams = {
            to_email: toEmail.trim(),
            to_name: userName || 'User',
            verification_code: verificationCode,
            message: `Your email verification code is: ${verificationCode}. This code will expire in 10 minutes.`
        };

        // console.log('Sending email with params:', { 
        //     to_email: toEmail, 
        //     to_name: userName,
        //     verification_code: verificationCode 
        // });

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        // console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        
        // Provide more specific error messages
        if (error.status === 422) {
            throw new Error('Invalid email configuration. Please check template settings.');
        } else if (error.status === 412) {
            throw new Error('Email service not configured properly.');
        } else {
            throw new Error(error.text || 'Failed to send verification email. Please try again.');
        }
    }
};
