iGREY Holdings website
======================
Upload everything in this folder to your hosting root (PHP 7.4 or newer).
It must run from a web server: opening index.html by double-click will not load listings or send forms.

Pages:   index.html, careers.html
Admin:   yourdomain.com/admin/  (add, edit, delete properties and career openings)
         1. Change the password in admin/config.php before going live (default: ChangeMe@123).
         2. Make the data/ and uploads/ folders writable by the web server (permission 755 or 775).
Forms:   send-enquiry.php emails hello@igreyholdings.com and sends the sender an automatic reply.
         Create the hello@igreyholdings.com mailbox on the hosting and set up SPF/DKIM for the domain
         so the replies do not land in spam.
Data:    data/properties.json and data/careers.json (the admin edits these files).
