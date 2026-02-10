const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCodQhiMSSss0zFeOJ1senN_wNIb7LNwm0'); // Replace with actual key
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Helper functions
function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function calculateLCM(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = lcm(result, arr[i]);
  }
  return result;
}

function calculateHCF(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = gcd(result, arr[i]);
  }
  return result;
}

function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  let series = [0, 1];
  for (let i = 2; i < n; i++) {
    series.push(series[i-1] + series[i-2]);
  }
  return series;
}

router.post('/bfhl', async (req, res) => {
  const keys = Object.keys(req.body);
  if (keys.length !== 1) {
    return res.status(400).json({ is_success: false, error: 'Exactly one key required' });
  }
  const key = keys[0];
  const value = req.body[key];
  let data;
  try {
    switch (key) {
      case 'fibonacci':
        if (typeof value !== 'number' || value < 0 || !Number.isInteger(value)) {
          return res.status(400).json({ is_success: false, error: 'Invalid fibonacci input' });
        }
        data = fibonacci(value);
        break;
      case 'prime':
        if (!Array.isArray(value) || !value.every(v => typeof v === 'number' && Number.isInteger(v))) {
          return res.status(400).json({ is_success: false, error: 'Invalid prime input' });
        }
        data = value.filter(isPrime);
        break;
      case 'lcm':
        if (!Array.isArray(value) || value.length < 2 || !value.every(v => typeof v === 'number' && Number.isInteger(v) && v > 0)) {
          return res.status(400).json({ is_success: false, error: 'Invalid lcm input' });
        }
        data = calculateLCM(value);
        break;
      case 'hcf':
        if (!Array.isArray(value) || value.length < 2 || !value.every(v => typeof v === 'number' && Number.isInteger(v) && v > 0)) {
          return res.status(400).json({ is_success: false, error: 'Invalid hcf input' });
        }
        data = calculateHCF(value);
        break;
      case 'AI':
        if (typeof value !== 'string' || value.trim() === '') {
          return res.status(400).json({ is_success: false, error: 'Invalid AI input' });
        }
        const prompt = `Answer the following question in exactly one word: ${value}`;
        const result = await model.generateContent(prompt);
        data = result.response.text().trim().split(' ')[0]; // Take first word
        break;
      default:
        return res.status(400).json({ is_success: false, error: 'Invalid key' });
    }
    res.json({
      is_success: true,
      official_email: 'neha.sharma@chitkara.edu.in', // Replace with actual Chitkara email
      data: data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ is_success: false, error: 'Internal server error' });
  }
});

router.get('/health', (req, res) => {
  res.json({
    is_success: true,
    official_email: 'neha.sharma@chitkara.edu.in'
  });
});

module.exports = router;
