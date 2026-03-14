import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { API_URL } from '../lib/supabase';
import { publicAnonKey } from '../../../utils/supabase/info';

export function SetupGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    checkData();
  }, []);

  const checkData = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      
      // If no custom profile data, show guide
      if (data.name === 'Developer') {
        setShowGuide(true);
      } else {
        setHasData(true);
      }
    } catch (error) {
      console.error('Error checking data:', error);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const response = await fetch(`${API_URL}/seed-data`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        setHasData(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      setSeeding(false);
    }
  };

  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome to Your Portfolio! 🎉</CardTitle>
              <CardDescription className="mt-2">
                Let's get your portfolio set up in a few simple steps
              </CardDescription>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start space-x-3">
            <Circle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Step 1: Create Admin Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Create an admin account to manage your portfolio content:
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                <p className="text-gray-800 dark:text-gray-200">POST {API_URL}/signup</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {`{ "email": "admin@example.com", "password": "secure-password", "name": "Your Name" }`}
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3">
            <Circle className={`h-6 w-6 flex-shrink-0 mt-1 ${hasData ? 'text-green-600' : 'text-blue-600'}`} />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Step 2: Add Sample Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Click below to populate your portfolio with sample data (projects, skills, certificates):
              </p>
              <Button
                onClick={handleSeedData}
                disabled={seeding || hasData}
                className="w-full sm:w-auto"
              >
                {seeding ? 'Adding Sample Data...' : hasData ? '✓ Data Added' : 'Add Sample Data'}
              </Button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3">
            <Circle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Step 3: Login & Customize</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                After creating your account, login at <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/login</code> and customize your portfolio from the admin dashboard.
              </p>
              <a href="/login">
                <Button variant="outline" className="w-full sm:w-auto">
                  Go to Login
                </Button>
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📚 Documentation</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Check the README.md file for complete setup instructions, API documentation, and customization tips.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
