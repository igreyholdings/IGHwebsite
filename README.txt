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
