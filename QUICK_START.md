# Quick Start Guide - Digital Solutions Consulting Website

## 🚀 Get Your Website Live in 3 Steps

### Step 1: Create GitHub Account (if you don't have one)
1. Go to [github.com/signup](https://github.com/signup)
2. Create a free account
3. Verify your email

### Step 2: Upload Your Website to GitHub

#### Option A: Using GitHub Web Interface (Easiest)
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `digital-solutions-website`
3. Keep it **Public** (required for free GitHub Pages)
4. Click "Create repository"
5. Click "uploading an existing file"
6. Drag and drop ALL files from the `website` folder
7. Click "Commit changes"

#### Option B: Using Command Line
```bash
cd "c:\Users\Administrator\Documents\Digital Solutions Consulting\website"
git init
git add .
git commit -m "Initial website commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/digital-solutions-website.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Branch: Select **main**
   - Folder: Select **/ (root)**
5. Click **Save**
6. Wait 2-3 minutes
7. Your site is live at: `https://YOUR-USERNAME.github.io/digital-solutions-website/`

## ✅ Verification Checklist

After deployment, check:
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Images and logos display
- [ ] All pages (About, Services, Portfolio, Contact) are accessible
- [ ] Mobile menu works on mobile devices
- [ ] Contact form displays (note: form submissions need additional setup)

## 📝 Next Steps

### 1. Set Up Contact Form
Choose one option:

**Option A: Deploy to Netlify (Recommended - Forms work automatically)**
1. Go to [netlify.com](https://www.netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Click "Deploy site"
5. Forms will work automatically!

**Option B: Use Formspree (Stay on GitHub Pages)**
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form endpoint
4. Edit `contact.html`:
```html
<!-- Replace this line -->
<form class="contact-form" id="contactForm" name="contact" method="POST" data-netlify="true">

<!-- With this -->
<form class="contact-form" id="contactForm" method="POST" action="https://formspree.io/f/YOUR-FORM-ID">
```

### 2. Add Your Contact Information
Edit the footer in all HTML files to add:
- Email address
- Phone number
- Physical address (if applicable)
- Social media links

### 3. Custom Domain (Optional)
1. Purchase a domain (e.g., `digitalsolutions.co.za`)
2. In your domain registrar's DNS settings, add:
   - Type: `CNAME`, Name: `www`, Value: `YOUR-USERNAME.github.io`
3. In GitHub repository settings → Pages → Custom domain
4. Enter your domain: `www.yourdomain.com`
5. Enable "Enforce HTTPS"

### 4. Add Google Analytics (Optional)
1. Create Google Analytics account
2. Get your tracking ID
3. Add tracking code to `<head>` of all HTML files

## 🎨 Customization Tips

### Update Colors
Edit `assets/css/style.css`:
```css
:root {
    --primary-red: rgb(251, 57, 66);     /* Main brand color */
    --secondary-gold: rgb(252, 213, 120); /* Accent color */
}
```

### Add New Services
1. Open `services.html`
2. Copy a service section
3. Update the content
4. Update the icon/image

### Add Portfolio Projects
1. Open `portfolio.html`
2. Copy a case study section
3. Update with new project details

## 🐛 Troubleshooting

### Images Not Showing
- Check that paths are correct: `assets/images/filename.png`
- Verify files were uploaded to GitHub
- Clear browser cache (Ctrl+Shift+R)

### Navigation Not Working
- Ensure `assets/js/main.js` exists
- Check browser console for errors (F12)

### Styles Not Applied
- Verify `assets/css/style.css` exists
- Check file paths in HTML `<link>` tags
- Clear browser cache

### Site Not Live After Enabling Pages
- Wait 5-10 minutes for initial deployment
- Check repository is public
- Verify branch and folder are set correctly

## 📞 Need Help?

Common resources:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify Documentation](https://docs.netlify.com)
- [Web Development on MDN](https://developer.mozilla.org)

## 🎉 You're Done!

Your professional website is now live! Share the URL:
- **GitHub Pages:** `https://YOUR-USERNAME.github.io/digital-solutions-website/`
- **Custom Domain:** `https://www.yourdomain.com` (if configured)

---

**Built for Digital Solutions Consulting**
*Agile. Simple. Adaptable.*
