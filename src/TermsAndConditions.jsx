export default function TermsAndConditions() {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };
  
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
          <h1 style={{fontFamily:"Cinzel,serif",fontSize:40,color:C.gold,textAlign:"center",margin:"0 0 10px"}}>Terms & Conditions</h1>
          <p style={{fontFamily:"Cinzel,serif",fontSize:12,color:C.goldDim,textAlign:"center",letterSpacing:1,margin:0}}>Last updated: March 2026</p>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:30}}>
          
          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>1. Entertainment Purpose Only</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              <strong style={{color:C.gold}}>Mystic Fortunes provides entertainment services only.</strong> Our palm readings and mystical insights are for entertainment, amusement, and spiritual curiosity. We do not claim to actually predict the future, provide professional advice, or possess any genuine supernatural abilities. The readings are generated using algorithms and are meant for recreational purposes only.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>2. Accuracy Disclaimer</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              We make no warranty regarding the accuracy, reliability, completeness, or timeliness of any information provided through our Service. The readings should not be relied upon for making important personal, financial, medical, or legal decisions.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>3. User Responsibilities</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              By using our Service, you agree that you are using it solely for entertainment purposes and that you will not rely on any readings or information for professional, medical, legal, or financial decisions. You are solely responsible for your interpretations and any actions taken based on the readings.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>4. Age Requirements</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              You must be at least 13 years old to use our Service. By using Mystic Fortunes, you represent and warrant that you are at least 13 years of age. If you are under 13, you may not use this Service.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>5. Image Rights</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              By uploading your palm image to our Service, you grant us permission to analyze and process the image solely for generating your reading. We do not use your image for any other purpose and do not store it permanently. You retain all ownership rights to your image.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>6. Limitation of Liability</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              To the fullest extent permitted by law, Mystic Fortunes shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of our Service or any readings provided.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>7. Professional Advice</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              Our readings do not constitute professional advice of any kind. If you require professional guidance regarding medical, legal, financial, or mental health matters, please consult with a qualified professional.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>8. Modifications to Service</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              We reserve the right to modify or discontinue our Service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>9. Prohibited Use</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              You agree not to use our Service for any unlawful purpose or in violation of any local, state, national, or international law. You agree not to use our Service in any way that could harm, threaten, or harass others.
            </p>
          </section>

          <section style={{marginBottom:30}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>10. Changes to Terms</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              We may update these Terms and Conditions from time to time. We will notify you of any changes by updating the "Last updated" date. Your continued use of the Service after any changes signifies your acceptance of the new Terms.
            </p>
          </section>

          <section style={{marginBottom:0}}>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:12}}>11. Contact Us</h2>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>
              If you have any questions about these Terms and Conditions, please contact us at support@mysticfortunes.ai.
            </p>
          </section>

        </div>

        <div style={{textAlign:"center",marginTop:40}}>
          <button onClick={handleBack} type="button" style={{fontFamily:"Cinzel,serif",fontSize:12,color:C.gold,letterSpacing:1,textDecoration:"none",background:"none",border:"none",cursor:"pointer",padding:0}}>← Back</button>
        </div>
      </div>
    </div>
  );
}
