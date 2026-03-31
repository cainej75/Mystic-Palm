// ═══════════════════════════════════════════════════════════════════════════
// useInAppBrowser Hook
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';

/**
 * Hook to detect in-app browser and get browser info
 * @returns {Object} Browser detection info
 */
export const useInAppBrowser = () => {
  const [browserInfo, setBrowserInfo] = useState({
    isInAppBrowser: false,
    isInstagram: false,
    isTikTok: false,
    isFacebook: false,
    userAgent: '',
  });

  useEffect(() => {
    const ua = navigator.userAgent || '';
    
    const info = {
      isInstagram: /Instagram/i.test(ua),
      isTikTok: /TikTok|Musical ly/i.test(ua),
      isFacebook: /FBAN|FBAV/i.test(ua),
      userAgent: ua,
    };
    
    info.isInAppBrowser = info.isInstagram || info.isTikTok || info.isFacebook;
    
    setBrowserInfo(info);
  }, []);

  return browserInfo;
};

// ═══════════════════════════════════════════════════════════════════════════
// useClipboard Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for clipboard copy functionality with feedback
 * @param {number} duration - How long to show success state (ms)
 * @returns {Object} { copy, copied }
 */
export const useClipboard = (duration = 2000) => {
  const [copied, setCopied] = useState(false);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  return { copy, copied };
};

// ═══════════════════════════════════════════════════════════════════════════
// Analytics Tracking
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Track in-app browser detection for analytics
 * @param {Object} browserInfo - Browser info object from detectInAppBrowser
 */
export const trackInAppBrowserDetected = (browserInfo) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'inapp_browser_detected', {
      browser_type: browserInfo.isInstagram
        ? 'instagram'
        : browserInfo.isTikTok
        ? 'tiktok'
        : browserInfo.isFacebook
        ? 'facebook'
        : 'unknown',
      user_agent: browserInfo.userAgent,
    });
  }

  // Custom event logging
  console.warn('[InAppBrowserGate] Detected in-app browser:', {
    isInstagram: browserInfo.isInstagram,
    isTikTok: browserInfo.isTikTok,
    isFacebook: browserInfo.isFacebook,
  });
};

/**
 * Track user action on landing page
 * @param {string} action - 'open_reading', 'copy_link', 'exit'
 */
export const trackLandingPageAction = (action) => {
  if (window.gtag) {
    window.gtag('event', 'inapp_landing_page_action', {
      action,
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// URL Utilities
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get current URL safe for copying
 * @returns {string} Current full URL
 */
export const getCurrentURL = () => {
  return window.location.href;
};

/**
 * Generate shareable URL with referral/source params
 * @param {string} source - Source identifier (instagram, tiktok, etc)
 * @returns {string} URL with utm params
 */
export const getShareableURL = (source = 'social') => {
  const url = new URL(window.location.href);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', 'inapp_browser');
  url.searchParams.set('utm_campaign', 'gate');
  return url.toString();
};

// ═══════════════════════════════════════════════════════════════════════════
// Advanced Detection
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get browser name for display/logging
 * @param {Object} browserInfo - Browser info object
 * @returns {string} Browser name
 */
export const getBrowserName = (browserInfo) => {
  if (browserInfo.isInstagram) return 'Instagram';
  if (browserInfo.isTikTok) return 'TikTok';
  if (browserInfo.isFacebook) return 'Facebook';
  return 'Unknown';
};

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Check if iOS device
 * @returns {boolean} True if iOS
 */
export const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Check if Android device
 * @returns {boolean} True if Android
 */
export const isAndroidDevice = () => {
  return /Android/.test(navigator.userAgent);
};

// ═══════════════════════════════════════════════════════════════════════════
// Example: Advanced Usage Component
// ═══════════════════════════════════════════════════════════════════════════

/*
Example of using these utilities:

import React, { useEffect } from 'react';
import {
  useInAppBrowser,
  useClipboard,
  trackInAppBrowserDetected,
  getBrowserName,
  isMobileDevice,
} from './utils/inappBrowserUtils';

function MyComponent() {
  const browserInfo = useInAppBrowser();
  const { copy, copied } = useClipboard();

  useEffect(() => {
    if (browserInfo.isInAppBrowser) {
      trackInAppBrowserDetected(browserInfo);
      console.log(`Detected ${getBrowserName(browserInfo)} on ${isMobileDevice() ? 'mobile' : 'desktop'}`);
    }
  }, [browserInfo]);

  return (
    <div>
      {browserInfo.isInAppBrowser && (
        <p>You're in {getBrowserName(browserInfo)} app!</p>
      )}
      <button onClick={() => copy(window.location.href)}>
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}

export default MyComponent;
*/
