import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { InAppBrowserGate } from './components/InAppBrowserGate'
import MysticFortunes from './App'
import PrivacyPolicy from './PrivacyPolicy'
import TermsAndConditions from './TermsAndConditions'
import BrokenLifeLine from './blog/posts/BrokenLifeLine'
import BrokenHeartLine from './blog/posts/BrokenHeartLine'
import FateLine from './blog/posts/FateLine'
import FortuneTellerMachine from './blog/posts/FortuneTellerMachine'
import BestPsychicBooks from './blog/posts/BestPsychicBooks'
import ExplorePage from './pages/ExplorePage'
import BlogArchive from './pages/BlogArchive'

// Component to track page views with Google Analytics
function PageTracker() {
  const location = useLocation()
  
  useEffect(() => {
    // Map routes to page titles
    const pageTitles = {
      '/explore': 'Explore — Mystic Fortunes',
      '/': 'Home — Mystic Fortunes',
      '/success': 'Payment Successful — Mystic Fortunes',
      '/cancelled': 'Payment Cancelled — Mystic Fortunes',
      '/privacy-policy': 'Privacy Policy — Mystic Fortunes',
      '/terms-and-conditions': 'Terms and Conditions — Mystic Fortunes',
      '/blog': "Madame Zafira's Insights — Archive",
      '/blog/broken-life-line': 'What Does a Broken Life Line Mean? — Madame Zafira\'s Insights',
      '/blog/broken-heart-line': 'The Broken Heart Line in Palmistry — Madame Zafira\'s Insights',
      '/blog/palmistry-fate-line': 'What Your Fate Line Really Says About Your Destiny — Madame Zafira\'s Insights',
      '/blog/fortune-teller-machine': 'Fortune Teller Machines — Madame Zafira\'s Insights',
      '/blog/best-psychic-books': 'Best Psychic Books — Madame Zafira\'s Sacred Reading List',
    }
    
    // Get the title for current route, or default to home
    const pageTitle = pageTitles[location.pathname] || 'Mystic Fortunes'
    
    // Update document title
    document.title = pageTitle
    
    // Send pageview to Google Analytics whenever route changes
    if (window.gtag) {
      window.gtag('config', 'G-V4BD2BREHJ', {
        page_path: location.pathname,
        page_title: pageTitle
      })
    }
  }, [location])
  
  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InAppBrowserGate>
      <Router>
        <PageTracker />
        <Routes>
          {/* Explore nav page */}
          <Route path="/explore" element={<ExplorePage />} />
          
          {/* Main app */}
          <Route path="/" element={<MysticFortunes />} />
          
          {/* Payment success page - Stripe redirects here after payment */}
          {/* Uses same component, payment verification happens via URL params */}
          <Route path="/success" element={<MysticFortunes />} />
          
          {/* Payment cancelled page - user clicks "back" on Stripe checkout */}
          <Route path="/cancelled" element={<MysticFortunes />} />
          
          {/* Policy pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

          {/* Blog — Madame Zafira's Insights */}
          <Route path="/blog" element={<BlogArchive />} />
          <Route path="/blog/broken-life-line" element={<BrokenLifeLine />} />
          <Route path="/blog/broken-heart-line" element={<BrokenHeartLine />} />
          <Route path="/blog/palmistry-fate-line" element={<FateLine />} />
          <Route path="/blog/fortune-teller-machine" element={<FortuneTellerMachine />} />
          <Route path="/blog/best-psychic-books" element={<BestPsychicBooks />} />
        </Routes>
      </Router>
    </InAppBrowserGate>
  </React.StrictMode>,
)
