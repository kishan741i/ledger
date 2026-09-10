# Person-Wise Ledger

A lightweight, browser-based **Person-Wise Smart Ledger System** for managing personal debit and credit transactions.

It works completely on the client side and stores ledger data in the browser's **Local Storage**, so no backend, database, or server is required.

---

## ✨ Features

### 👤 Person-Wise Ledger

* Add transactions for different persons.
* Automatically maintains a unique person directory.
* Persons are displayed in **A–Z alphabetical order**.
* Click a person to view only their transactions.
* Selected person remains active while adding multiple entries.
* Use the **Change** button to select another person.
* Person names support automatic suggestions while typing.

### 💰 Transaction Management

Each transaction contains:

* Person Name
* Date
* Transaction Type

  * **Given (Debit)**
  * **Taken (Credit)**
* Amount in Indian Rupees (₹)

### 📅 Automatic Date

If the user does not manually select a date, the application automatically uses the **current date**.

Example:

```text
Date: 2026-09-10
```

The date is also automatically restored when creating a new entry.

### 📊 Ledger Summary

The dashboard displays:

* **Total Given**
* **Total Taken**
* **Net Balance**

For example:

```text
Total Given   ₹5,000.00
Total Taken   ₹2,000.00
Net Balance   ₹3,000.00
```

A positive balance is shown in green, while a negative balance is shown in red.

### 🔎 Transaction Search

The transaction search field can search by:

* Person name
* Transaction date

Example:

```text
Rahul
```

or:

```text
2026-09-10
```

### ✏️ Edit Transactions

Existing transactions can be edited.

The edit operation allows changing:

* Person
* Date
* Type
* Amount

The form changes from:

```text
Adding
```

to:

```text
Editing
```

and the button changes from:

```text
Save Entry
```

to:

```text
Update Entry
```

### 🗑️ Delete Transactions

Transactions can be deleted using the delete button.

A confirmation dialog appears before deletion:

```text
Are you sure you want to delete this transaction?
```

### 💾 Local Storage

All ledger data is stored in the browser using:

```javascript
localStorage
```

The main storage key is:

```text
nexora_ledger_entries
```

Theme preference is stored separately:

```text
nexora_theme
```

Because the application uses Local Storage, the data remains available after refreshing or reopening the browser on the same device/browser.

---

## 📥 Export & Import

### Export

The **Export** button creates a JSON backup of the complete ledger.

Example filename:

```text
nexora_ledger_backup_2026-09-10.json
```

The exported file contains the ledger entries in JSON format.

Example:

```json
[
  {
    "id": "1",
    "person": "Sunil",
    "date": "2026-06-01",
    "type": "given",
    "amount": 500
  }
]
```

### Import

The **Import** button allows you to restore ledger data from a previously exported `.json` file.

Supported format:

```text
.json
```

> Always keep a backup of important ledger data before importing new data.

---

## 🌙 Dark & Light Theme

The application includes a built-in light/dark theme system.

Click:

```text
Theme
```

to switch between:

* Light Mode
* Dark Mode

The selected theme is saved in Local Storage, so it remains active after refreshing the page.

---

## 🎨 UI Features

The interface uses:

* Responsive layout
* Tailwind CSS
* Dark mode
* Modern card design
* RGB animated buttons
* Hover animations
* Responsive transaction table
* Person directory
* Responsive mobile layout
* Ledger-style background grid

The application uses the Tailwind CSS CDN:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

No Tailwind installation is required.

---

## 📱 Responsive Design

The application is designed to work on:

* Desktop
* Laptop
* Tablet
* Mobile devices

The main layout automatically changes depending on screen size.

Desktop:

```text
┌───────────────────────────────────────────────┐
│              PERSON-WISE LEDGER               │
├────────────────┬──────────────────────────────┤
│ New Entry      │ Summary                      │
│                │                              │
│ Persons        │ Transactions                 │
│ Directory      │                              │
└────────────────┴──────────────────────────────┘
```

Mobile:

```text
┌─────────────────────┐
│  PERSON-WISE LEDGER │
├─────────────────────┤
│ New Entry           │
├─────────────────────┤
│ Persons Directory   │
├─────────────────────┤
│ Summary             │
├─────────────────────┤
│ Transactions        │
└─────────────────────┘
```

---

## 🚀 Getting Started

This is a **single HTML file application**, so installation is extremely simple.

### 1. Create the HTML file

Save the provided code as:

```text
index.html
```

Recommended project structure:

```text
person-wise-ledger/
│
├── index.html
└── README.md
```

### 2. Open the application

Simply double-click:

```text
index.html
```

or open it in a modern browser.

Recommended browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

No:

* Node.js
* PHP
* MySQL
* Python server
* Backend
* Database

is required.

---

## 🧪 Initial Demo Data

The application starts with sample transactions:

| Person | Date       | Type  | Amount |
| ------ | ---------- | ----- | -----: |
| Sunil  | 2026-06-01 | Given |   ₹500 |
| Sumit  | 2026-06-02 | Taken |   ₹200 |
| Rahul  | 2026-06-03 | Given | ₹1,000 |
| Ravi   | 2026-06-04 | Taken |   ₹300 |

These values are defined in:

```javascript
const defaultInitialData = [...]
```

If Local Storage does not contain existing ledger data, these records are automatically loaded.

---

## 🧹 Removing Demo Data

If you want to start with an empty ledger, change:

```javascript
const defaultInitialData = [
    ...
];
```

to:

```javascript
const defaultInitialData = [];
```

Alternatively, open the browser's Developer Tools and clear Local Storage for the website.

---

## 🗂️ Data Structure

Each ledger entry uses the following structure:

```javascript
{
    id: "unique-id",
    person: "Rahul",
    date: "2026-09-10",
    type: "given",
    amount: 1000
}
```

### Fields

| Field    | Description                   |
| -------- | ----------------------------- |
| `id`     | Unique transaction identifier |
| `person` | Person's name                 |
| `date`   | Transaction date              |
| `type`   | `given` or `taken`            |
| `amount` | Transaction amount            |

---

## 🧮 Balance Calculation

The application calculates the balance using:

```text
Net Balance = Total Given - Total Taken
```

Example:

```text
Given = ₹10,000
Taken = ₹4,000

Net Balance = ₹10,000 - ₹4,000
            = ₹6,000
```

If the result is negative:

```text
Given = ₹2,000
Taken = ₹5,000

Net Balance = ₹2,000 - ₹5,000
            = -₹3,000
```

The interface displays the absolute amount and uses the color to indicate whether the balance is positive or negative.

---

## 🔐 Privacy

The application is designed as a **local browser application**.

Ledger information is stored in:

```text
Browser Local Storage
```

The application does not contain a backend database.

Therefore:

* Data stays on the current browser/device.
* There is no automatic cloud synchronization.
* Clearing browser site data can remove the ledger.
* Using another browser will not automatically show the same ledger.
* Exporting a JSON backup is recommended for important data.

### Important

This application should not be considered a replacement for a professional accounting system or a secure financial database.

---

## ☁️ Server / Backend Requirement

### Not Required

The application is completely client-side.

Architecture:

```text
User
  │
  ▼
index.html
  │
  ├── HTML
  ├── Tailwind CSS
  └── JavaScript
       │
       ▼
   Local Storage
```

There is no:

```text
Frontend → Backend → Database
```

architecture.

---

## 🌐 Hosting

Because the application is a static HTML application, it can be hosted on many static hosting services.

Examples include:

* GitHub Pages
* Netlify
* Vercel
* Cloudflare Pages
* Any normal web server

It can also be used completely offline after the required Tailwind CSS resource has loaded.

> Note: Because Tailwind CSS is loaded from a CDN, completely offline use requires either keeping the CDN dependency available or replacing it with a locally bundled CSS version.

---

## 🛠️ Technologies Used

### HTML5

Used for the application structure.

### JavaScript

Used for:

* Ledger management
* Local Storage
* Search
* Filtering
* Sorting
* Import/export
* Theme switching
* Date handling
* Editing
* Deleting
* Person suggestions

### Tailwind CSS

Used for:

* Responsive layout
* Components
* Colors
* Dark mode
* Spacing
* Typography
* Animations
* Responsive design

Tailwind is loaded using its CDN.

---

## 📁 Project Structure

```text
person-wise-ledger/
│
├── index.html
└── README.md
```

The entire application logic is currently contained inside:

```text
index.html
```

JavaScript is located near the bottom of the HTML file inside:

```html
<script>
    ...
</script>
```

---

## 🔧 Main JavaScript Functions

### Theme

```javascript
initTheme()
toggleTheme()
```

### Date

```javascript
setDefaultDate()
```

### Person Management

```javascript
getUniquePersons()
handlePersonInput()
handlePersonKeyDown()
lockPerson()
unlockPerson()
filterPerson()
```

### Ledger

```javascript
handleFormSubmit()
saveAndRefresh()
renderApp()
editEntry()
deleteEntry()
resetForm()
resetToHome()
```

### Backup

```javascript
exportData()
importData()
```

---

## 🔄 Application Flow

### Adding a transaction

```text
Enter Person
     ↓
Select/Confirm Date
     ↓
Select Given/Taken
     ↓
Enter Amount
     ↓
Save Entry
     ↓
Local Storage
     ↓
Dashboard Refresh
```

### Editing

```text
Transaction
     ↓
Edit
     ↓
Load Existing Data
     ↓
Modify Details
     ↓
Update Entry
     ↓
Local Storage
     ↓
Refresh
```

### Deleting

```text
Delete
   ↓
Confirmation
   ↓
Remove Transaction
   ↓
Local Storage
   ↓
Refresh
```

---

## 🔍 Person Search & Suggestions

When typing a person's name, the application checks existing names.

For example, if the directory contains:

```text
Rahul
Ravi
Sunil
Sumit
```

and the user types:

```text
Ra
```

the application can suggest:

```text
Rahul
```

The suggestion can be accepted using:

* Tab
* Arrow Right
* Arrow Down
* Enter

---

## 📅 Date Behavior

The date field automatically receives today's date when it is empty.

The logic is:

```javascript
const today = new Date().toISOString().split('T')[0];
```

When saving an entry, the application also checks whether the date is empty.

If it is empty, today's date is automatically assigned.

This prevents transactions from being saved without a date.

---

## ⚠️ Limitations

Current version has some limitations:

1. Data is stored only in browser Local Storage.
2. There is no cloud synchronization.
3. There is no login/authentication system.
4. There is no multi-device synchronization.
5. Imported JSON data is trusted as provided.
6. Tailwind CSS is loaded from CDN.
7. The application is intended primarily for personal/local ledger management.
8. Clearing browser site data can remove locally stored transactions.

---

## 🔒 Backup Recommendation

For important ledger information, periodically use:

```text
Export
```

and save the generated file somewhere safe.

Recommended backup structure:

```text
Ledger-Backups/
│
├── ledger_backup_2026-09-01.json
├── ledger_backup_2026-09-05.json
└── ledger_backup_2026-09-10.json
```

---

## 📝 License

This project is intended for personal use.

You may modify the HTML, CSS, and JavaScript according to your requirements.

---

## 📌 Project Information

**Project Name:** Person-Wise Ledger

**Subtitle:** Person-wise Smart Ledger System

**Version:** 1.0

**Year:** 2026

---

## ❤️ About

A simple, local-first tool designed to make person-wise transaction tracking fast, convenient, and easy to manage.
