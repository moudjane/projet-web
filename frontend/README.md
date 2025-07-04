# projet-web-front

A modern messaging web application built with Vue 3, Vite, TypeScript, Apollo GraphQL, Pinia, and TailwindCSS.

---

### Project Setup

```sh
git clone git@github.com:moudjane/projet-web.git
```

```sh
cd projet-web/frontend
```

```sh
npm install
```

```sh
npm run dev
```

---

### Environment Variables

Create a `.env` file and copy the content of `.env.example` into your new `.env` file.  

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

---

### GraphQL Code Generation

This project uses GraphQL Code Generator to automatically generate TypeScript types and hooks from your GraphQL operations.

#### How to use GraphQL Codegen

1. **Add your GraphQL operations** to the appropriate files:
   - **Queries**: Add to `src/graphql/queries.ts`
   - **Mutations**: Add to `src/graphql/mutations.ts`

2. **Example Query**:

   ```typescript
   // src/graphql/queries.ts
   import { graphql } from "../gql/gql"

   export const GET_USER_BY_ID = graphql(`
     query GetUserById($id: String!) {
       getUserById(id: $id) {
         id
         username
         email
         createdAt
       }
     }
   `)
   ```

3. **Example Mutation**:

   ```typescript
   // src/graphql/mutations.ts
   import { graphql } from "../gql/gql"

   export const DELETE_MESSAGE = graphql(`
     mutation DeleteMessage($messageId: String!) {
       deleteMessage(messageId: $messageId) {
         id
         success
       }
     }
   `)
   ```

4. **Generate TypeScript types** by running:

   ```sh
   npm run codegen
   ```

   This command will:

   - Connect to your GraphQL schema at `http://localhost:4000/graphql`
   - Scan all `.vue` and `.ts` files in the `src/` directory
   - Generate TypeScript types and helpers in the `src/gql/` directory
   - Create type-safe GraphQL operations you can import and use

5. **Use the generated types** in your Vue components:

   ```typescript
   // In a Vue component
   import { useQuery, useMutation } from '@vue/apollo-composable'
   import { GET_USER_BY_ID } from '@/graphql/queries'
   import { DELETE_MESSAGE } from '@/graphql/mutations'

   // Type-safe query
   const { result, loading, error } = useQuery(GET_USER_BY_ID, { id: 'user-123' })

   // Type-safe mutation
   const { mutate: deleteMessage } = useMutation(DELETE_MESSAGE)
   ```

#### Important Notes

- Make sure your backend GraphQL server is running on `http://localhost:4000/graphql` before running codegen
- Run `npm run codegen` after adding or modifying any GraphQL operations
- The generated files in `src/gql/` are auto-generated - don't edit them manually
- All GraphQL operations must be wrapped with the `graphql()` function from `../gql/gql`