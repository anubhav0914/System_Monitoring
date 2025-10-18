# 🔒 PC Protection Service (Background Analytics)

A background analytics service built using **.NET BackgroundService** that continuously monitors system resource usage and simulates security events.

---

## 🚀 Features

- Monitors **CPU** and **memory usage** of the process every 15 seconds.
- Generates simulated **security events** (e.g., suspicious process detection).
- Stores analytics data persistently in a `data.json` file.
- Maintains the **latest 100 records** only.
- Logs live analytics data to the console.

---

## 🧩 Tech Stack

- **Language:** C#
- **Framework:** .NET 9
- **Host Type:** BackgroundService (Worker Service)
- **Data Format:** JSON

---

## 📂 Project Structure

