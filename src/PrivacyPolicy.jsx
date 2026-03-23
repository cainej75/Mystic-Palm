export default function PrivacyPolicy() {
  const C = {
    bg:      "#080510",
    surface: "#100c1a",
    border:  "#2e1f40",
    gold:    "#c9a84c",
    goldDim: "#7a6530",
    rose:    "#b0405a",
    roseDim: "#5c1a2a",
    teal:    "#2a8a7a",
    cream:   "#e8d5b8",
    muted:   "#6a5870",
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap');
        body { margin: 0; padding: 0; }
        a { color: ${C.gold}; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>

      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at center,transparent 30%,rgba(8,5,16,0.65) 100%)",pointerEvents:"none",zIndex:1}}/>

      <div style={{maxWidth:700,margin:"0 auto",padding:"40px 20px 60px",position:"relative",zIndex:2}}>
        <div style={{marginBottom:40}}>
          <h1 style={{fontFamily:"Cinzel,serif",fontSize:40,color:C.gold,textAlign:"center",margin:"0 0 10px"}}>Privacy Policy</h1>
          <p style={{fontFamily:"Cinzel,serif",fontSize:12,color:C.goldDim,textAlign:"center",letterSpacing:1,margin:0}}>Last updated: March 2024</p>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:30}}>
          
          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>Introduction</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              Mystic Fortunes ("we," "us," "our," or "Company") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>Information Collection and Use</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              Our website collects information you provide directly when using our palm reading service. This includes your name and birth date, which are used solely to generate your personalized reading. We do not use cookies or tracking technologies.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>Data Storage and Security</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              We do not store your personal information on our servers. Your name and birth date are processed in real-time to generate your reading and are not retained after your session ends. Your palm images are used only for analysis and are not stored permanently.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>Data Sharing</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              We do not share, sell, or distribute your personal information to any third parties. Your data is yours alone. We do not sell your information to advertisers, marketers, or any other organizations.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>Third-Party Services</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              Our service uses artificial intelligence to generate personalized readings. We do not store or retain the data used in this process beyond the immediate session. No personal information is sent to or stored by these services.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>Children's Privacy</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information immediately.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>Changes to This Privacy Policy</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section style={{marginBottom:0}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>Contact Us</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              If you have any questions about this Privacy Policy, please contact us at support@mysticfortunes.ai.
            </p>
          </section>

        </div>

        <div style={{textAlign:"center",marginTop:40}}>
          <a href="/" style={{fontFamily:"Cinzel,serif",fontSize:12,color:C.gold,letterSpacing:1,textDecoration:"none"}}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}
