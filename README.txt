iGREY Holdings website - GitHub + Vercel
========================================
Put everything in this folder at the ROOT of your GitHub repo (index.html, api/, data/, admin/, assets/ ...) and push.
Vercel redeploys automatically.

ADMIN (yourdomain.com/admin/) saves straight to the site:
  Each save commits data/properties.json or data/careers.json to GitHub; Vercel then redeploys (about a minute).

ONE-TIME SETUP
1. GitHub > Settings > Developer settings > Fine-grained tokens > Generate new token.
   Repository access: only this repo. Permissions: Contents = Read and write. Copy the token.
2. Vercel > your project > Settings > Environment Variables. Add:
     ADMIN_PASSWORD  = the password you want for /admin
     SESSION_SECRET  = any long random text (40+ characters)
     GITHUB_TOKEN    = the token from step 1
     GITHUB_REPO     = yourgithubname/your-repo-name
     GITHUB_BRANCH   = main   (only if your branch is not main)
3. Vercel > Deployments > Redeploy (so the variables are picked up).
4. Open /admin/ and sign in.

FORMS: contact and careers forms use formsubmit.co -> hello@igreyholdings.com (click the activation email once).
Property photos uploaded in the admin are saved to assets/uploads/ in the repo.

KITTY - AI CHAT ASSISTANT (chat button, bottom-right) - 100% FREE APIs
  Kitty answers visitors from the company info in api/_prompt.js plus the live data/properties.json and data/careers.json.
  No paid API is used. Add ONE or BOTH free keys in Vercel > Settings > Environment Variables, then Deployments > Redeploy:

  1. GROQ_API_KEY   (recommended, free, no credit card)
       Get it at console.groq.com > API Keys > Create API Key.
       Kitty first uses llama-3.3-70b-versatile; if that model's free daily limit is used up it switches to llama-3.1-8b-instant
       (it has its own, much larger free limit), so Kitty keeps answering.
  2. GEMINI_API_KEY (optional backup, free)
       Get it at aistudio.google.com > Get API key. Used only if Groq is unavailable.
       Note: on Google's free tier, Google may use the messages to improve its products.

  Optional settings (only if a model name changes): GROQ_MODEL, GROQ_FALLBACK_MODEL, GEMINI_MODEL.
  Free tiers have rate limits that the providers can change. Kitty also limits each visitor to 25 messages per 10 minutes.
  If every free service is busy, Kitty politely asks the visitor to email hello@igreyholdings.com or call +91 8147172449.
  To change Kitty's name, greeting or quick-reply buttons edit chat.js; to change what Kitty knows or how she answers edit api/_prompt.js.
  The API keys stay on the server (Vercel) and are never visible in the website code.

PROPERTY DETAILS, IDs AND ENQUIRIES
  Each property has a Property ID (IGH-0001...), type (flat, villa, builder floor...), area in sq.ft, bedrooms, bathrooms,
  furnished type, description and amenities (shown with icons on property.html). Edit them all in /admin.
  "Enquire about this property" opens a form; the enquiry (with Property ID, title, price and link) is emailed to hello@igreyholdings.com
  through FormSubmit, and the visitor gets an automatic reply. To add an amenity, add a line to amenities.js.

FORMS WITHOUT LEAVING THE PAGE (contact, careers, property enquiries)
  After sending, visitors only see a confirmation message under the form (no FormSubmit page).
  - Works immediately through FormSubmit (emails hello@igreyholdings.com). In this mode there is NO automatic reply email.
  - To also send the visitor an automatic reply from hello@igreyholdings.com (and attach resumes reliably), set up Resend (free plan):
      1. resend.com > create account > Domains > add igreyholdings.com and add the DNS records it shows (at your domain registrar).
      2. resend.com > API Keys > create a key.
      3. Vercel > Settings > Environment Variables: RESEND_API_KEY = that key. Redeploy.
    api/enquiry.js then sends the enquiry to hello@ and the auto-reply to the visitor. Optional: ENQUIRY_TO, ENQUIRY_FROM.
