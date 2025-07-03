# projet-web-front

A modern messaging web application built with Vue 3, Vite, TypeScript, Apollo GraphQL, Pinia, and TailwindCSS.

---

### Project Setup

```sh
git clone git@github.com:moudjane/projet-web.git
```

```sh
cd projet-web
```

```sh
npm install
```

```sh
npm run dev
```

---

### Project structure

```sh
client/
├── components/    # Shared Vue components (forms, layout and dashboard.)
├── pages/         # Top-level route pages
├── ui/            # Small reusable UI primitives (Button, Input and Logo)
├── stores/        # Pinia stores for app-wide state management
├── gql/           # GraphQL codegen types and helpers (auto-generated)
├── graphql/       # GraphQL queries, mutations, and fragments
├── router/        # Vue Router configuration and routes
└── App.vue        # Root Vue component
```

---

### Features

#### Authentification
- JWT authentication
- Register and log in
- Store JWT token locally
- Logout

#### Messaging
- Create new conversations with other users
- Send and receive messages in real time (GraphQL subscriptions)
- View list of conversations and messages
- Responsive chat interface

#### Users
- List all registered users
- Search for users to start a new conversation
- View and edit your profile (username, email, password)