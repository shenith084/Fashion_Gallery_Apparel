import { adminDb } from './firebase/admin';

export type ActivityLogParams = {
  userId: string;
  userName: string;
  userAvatar?: string;
  module: string;
  action: string;
  description: string;
  device?: string;
  browser?: string;
  status?: 'success' | 'failed' | 'critical';
};

export const logActivity = async (params: ActivityLogParams) => {
  try {
    const logData = {
      ...params,
      userAvatar: params.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${params.userName}&backgroundColor=222222&textColor=ffffff`,
      device: params.device || 'Desktop',
      browser: params.browser || 'Chrome',
      status: params.status || 'success',
      timestamp: Date.now(),
    };

    await adminDb.collection('activity_logs').add(logData);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
