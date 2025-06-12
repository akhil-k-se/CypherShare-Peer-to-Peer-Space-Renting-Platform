import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Provider_Setting = () => {
  const [storage, setStorage] = useState(200);
  const [autoStart, setAutoStart] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const maxStorage = 500;

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/provider/getInfo', {
          withCredentials: true,
        });
        setName(response.data.name);
        setAutoStart(response.data.autoStart);
        setNotificationsEnabled(response.data.notification);
        setStorage(response.data.totalStorage);

      } catch (e) {
        console.log(e?.response?.data?.msg || 'Error fetching user info');
      }
    };

    fetchUser();
  }, []);

  const getSliderBackground = () => {
    const percent = (storage / maxStorage) * 100;
    return {
      background: `linear-gradient(to right, #fbbf24 ${percent}%, #374151 ${percent}%)`,
    };
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(
        'https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/provider/updateSettings',
        {
          storage,
          autoStart,
          notificationsEnabled,
        },
        { withCredentials: true }
      );

      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage(error?.response?.data?.msg || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-full flex flex-col relative font-manrope text-white gap-8 px-4 sm:px-6 lg:px-8'>
      <div className='text-4xl sm:text-5xl lg:text-6xl'>Provider Settings</div>

      <div className='w-full h-full border border-gray-300 rounded-xl flex flex-col items-center gap-6 p-5'>
        {/* Storage Limit Slider */}
        <div className='flex flex-col lg:flex-row w-full gap-4 border border-gray-300 rounded-xl items-center p-4'>
          <div className='text-2xl sm:text-3xl'>Storage Limit</div>
          <div className='w-full flex-1'>
            <input
              type='range'
              min={0}
              max={maxStorage}
              step={10}
              value={storage}
              onChange={(e) => setStorage(Number(e.target.value))}
              style={getSliderBackground()}
              className='w-full h-2 rounded-lg appearance-none cursor-pointer accent-white'
            />
          </div>
          <div className='text-xl sm:text-2xl min-w-[80px] text-center'>{storage}GB</div>
        </div>

        {/* Auto-Start Toggle */}
        <div className='flex flex-col sm:flex-row w-full gap-4 border border-gray-300 rounded-xl items-center justify-between p-4'>
          <div className='flex flex-col gap-2 text-center sm:text-left'>
            <div className='text-2xl sm:text-4xl font-semibold'>Auto-Start</div>
            <div className='text-base sm:text-xl text-gray-400'>Auto-Start on System Boot</div>
          </div>

          <label className='relative inline-flex items-center cursor-pointer mt-2 sm:mt-0'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={autoStart}
              onChange={() => setAutoStart((prev) => !prev)}
            />
            <div className='w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-amber-400 transition-colors duration-300'></div>
            <div className='absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 transform peer-checked:translate-x-full'></div>
          </label>
        </div>

        {/* Notification Toggle */}
        <div className='flex flex-col sm:flex-row w-full gap-4 border border-gray-300 rounded-xl items-center justify-between p-4'>
          <div className='flex flex-col gap-2 text-center sm:text-left'>
            <div className='text-2xl sm:text-4xl font-semibold'>Notification Preference</div>
            <div className='text-base sm:text-xl text-gray-400'>Email/Push Notifications</div>
          </div>

          <label className='relative inline-flex items-center cursor-pointer mt-2 sm:mt-0'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled((prev) => !prev)}
            />
            <div className='w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-amber-400 transition-colors duration-300'></div>
            <div className='absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 transform peer-checked:translate-x-full'></div>
          </label>
        </div>

        {/* Account Section */}
        <div className='flex flex-col sm:flex-row w-full gap-4 border border-gray-300 rounded-xl items-center justify-between p-4'>
          <div className='flex flex-col gap-1 text-center sm:text-left'>
            <div className='text-2xl sm:text-4xl font-semibold'>Account</div>
            <div className='text-lg sm:text-2xl text-gray-400'>{name ? name : '...'}</div>
          </div>
          <button className='border border-gray-300 bg-[#0d0d0e] px-6 sm:px-10 py-3 sm:py-5 rounded-xl text-lg sm:text-xl'>
            Change Password
          </button>
        </div>

        {/* Save Button */}
        <button
          disabled={loading}
          onClick={handleSave}
          className={`border border-gray-300 bg-[#0d0d0e] px-6 sm:px-10 py-3 sm:py-5 rounded-xl text-lg sm:text-xl hover:cursor-pointer ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>

        {/* Success/Error message */}
        {message && (
          <div className='text-center text-sm text-amber-400 font-semibold'>{message}</div>
        )}

        {/* Brand Display */}
        <div className='flex w-full h-full gap-5 border border-gray-300 rounded-xl items-center justify-center text-6xl sm:text-7xl lg:text-9xl overflow-hidden text-center'>
          CypherShare
        </div>
      </div>
    </div>
  );
};

export default Provider_Setting;
