import axios from 'axios';
import React, { useState } from 'react';
import { useAdminContext } from '../context/AdminContext';

export default function AddCaptcha() {
  const { backendUrl, token } = useAdminContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [siteKey, setSiteKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/UpdateCaptcha`,
        { siteKey, secretKey },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setMessage('Captcha updated successfully!');
      } else {
        setMessage('Failed to update captcha.');
      }

      setSecretKey('');
      setSiteKey('');
    } catch (error: any) {
      console.error('Error updating captcha:', error);
      setMessage('An error occurred while updating captcha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Google Captcha V3
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="siteKey">
              Site Key
            </label>
            <input
              type="text"
              id="siteKey"
              value={siteKey}
              onChange={(e) => setSiteKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="secretKey">
              Secret Key
            </label>
            <input
              type="text"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
