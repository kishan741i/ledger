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
    "person": "person-N",
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
