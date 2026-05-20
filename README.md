# SipSync: A coffee shop map guide

## MEMBERS
- Madriaga, Mia Flor D.
- Melanio, Erica T.
- Roda, Mikaela Denise V.
- Sayre, Jadhel D.


## TECH
The data within the database were from Open Brewery DB API and a mixed of user input cafes.
API: https://api.openbrewerydb.org/v1/breweries/  

The map feature is from Leaflet

The Backend was deployed in Railway while the Frontend was deployed in Vercel


## Local Setup

### Step 1 — Clone the repo

git clone https://github.com/[your-username]/group5_finals
cd group5_finals

### Step 2 — Setup the Database
1. Open **XAMPP** → start **Apache** and **MySQL**
2. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
3. Click **New** → name it `breweries_db` → click **Create**
4. Click the **Import** tab
5. Choose file → select `coffeeshop-backend/files/breweries_db.sql` (import the sql file from the files folder in the backend folder of the project)
6. Click **Go**

### Step 3 — Setup the Backend
cd coffeeshop-backend
npm install (installs the node module)

Create your `.env` file 

Your `.env` should look like this:
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=breweries_db
PORT=5000

Run the backend:
node server.js

### Step 4 — Import Brewery Data (run once only)
**YOU MUST HAVE THUNDER CLIENT ISNTALLED IN YOUR VSCODE AS AN EXTENSION**
go to extensions on the left side of vscode

search for thunder client and click install. trust authors and install.

Open Thunder Client:
Click new request

Click the drop down and click POST
copy and paste this and click send: http://localhost:5000/api/cafes/import

Wait for the response:
```json
{ "message": "Import done! Total: XXXX breweries imported." }
```
> ⚠️ Only run this once

Refresh your phpmyadmin cafes_tbl to see results or in your thunder client:
Click the drop down and click GET
copy and paste this and click send: http://localhost:5000/api/cafes

