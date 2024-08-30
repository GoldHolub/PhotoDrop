PhotoDrop Project
---
🚀 **Getting Started**

  **Prerequisites**
  
  >Ensure you have the following installed:

- Node.js (version 14 or above)
- PostgreSQL (or any compatible database)
- Retool.com for administrative operations

**Installation**\
Clone the repository:

```
git clone https://github.com/yourusername/photodrop-backend.git
cd photodrop-backend
```
Install dependencies:

```
npm install
```
**Configure environment variables:**

>Create a .env file in the root directory with the following variables:

```
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**Running the Server**

```
npm start
```

🔑 **Authentication & Authorization**
JWT tokens are used for user authentication and authorization. Roles like Client, Photographer, and Admin are implemented to manage access control.
