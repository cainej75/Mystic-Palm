import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { InAppBrowserGate } from './components/InAppBrowserGate'
import MysticFortunes from './App'
import PrivacyPolicy from './PrivacyPolicy'
import TermsAndConditions from './TermsAndConditions'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InAppBrowserGate>
      <Router>
        <Routes>
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
        </Routes>
      </Router>
    </InAppBrowserGate>
  </React.StrictMode>,
)
