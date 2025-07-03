/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation UpdateProfile($updateProfileData: UpdateProfileInput!) {\n    updateProfile(updateProfileData: $updateProfileData) {\n      id\n      username\n      email\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password)\n  }\n": typeof types.LoginDocument,
    "\n  mutation Signup($username: String!, $email: String!, $password: String!) {\n    signup(username: $username, email: $email, password: $password)\n  }\n": typeof types.SignupDocument,
    "\n  mutation SendMessage($content: String!, $conversationId: String!) {\n    sendMessage(content: $content, conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n": typeof types.SendMessageDocument,
    "\n  mutation CreateConversation($title: String!, $targetUserId: String!) {\n    createConversation(title: $title, targetUserId: $targetUserId) {\n      id\n      title\n      users {\n        id\n        username\n      }\n    }\n  }\n": typeof types.CreateConversationDocument,
    "\n  query GetConversationById($id: String!) {\n    getMyConversations {\n      id\n      title\n      users {\n        id\n        username\n      }\n    }\n  }\n": typeof types.GetConversationByIdDocument,
    "\n  query GetMessagesByConversation($conversationId: String!) {\n    getMessagesByConversation(conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n": typeof types.GetMessagesByConversationDocument,
    "\n  query Me {\n    me {\n      id\n      username\n      email\n    }\n  }\n": typeof types.MeDocument,
    "\n  query GetMyConversations {\n    getMyConversations {\n      id\n      title\n      createdAt\n      users {\n        id\n        username\n        email\n      }\n      messages {\n        id\n        content\n        createdAt\n        user {\n          id\n          username\n        }\n      }\n    }\n  }\n": typeof types.GetMyConversationsDocument,
    "\n  query GetAllUsers {\n    getAllUsers {\n      id\n      username\n      email\n    }\n  }\n": typeof types.GetAllUsersDocument,
};
const documents: Documents = {
    "\n  mutation UpdateProfile($updateProfileData: UpdateProfileInput!) {\n    updateProfile(updateProfileData: $updateProfileData) {\n      id\n      username\n      email\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password)\n  }\n": types.LoginDocument,
    "\n  mutation Signup($username: String!, $email: String!, $password: String!) {\n    signup(username: $username, email: $email, password: $password)\n  }\n": types.SignupDocument,
    "\n  mutation SendMessage($content: String!, $conversationId: String!) {\n    sendMessage(content: $content, conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n": types.SendMessageDocument,
    "\n  mutation CreateConversation($title: String!, $targetUserId: String!) {\n    createConversation(title: $title, targetUserId: $targetUserId) {\n      id\n      title\n      users {\n        id\n        username\n      }\n    }\n  }\n": types.CreateConversationDocument,
    "\n  query GetConversationById($id: String!) {\n    getMyConversations {\n      id\n      title\n      users {\n        id\n        username\n      }\n    }\n  }\n": types.GetConversationByIdDocument,
    "\n  query GetMessagesByConversation($conversationId: String!) {\n    getMessagesByConversation(conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n": types.GetMessagesByConversationDocument,
    "\n  query Me {\n    me {\n      id\n      username\n      email\n    }\n  }\n": types.MeDocument,
    "\n  query GetMyConversations {\n    getMyConversations {\n      id\n      title\n      createdAt\n      users {\n        id\n        username\n        email\n      }\n      messages {\n        id\n        content\n        createdAt\n        user {\n          id\n          username\n        }\n      }\n    }\n  }\n": types.GetMyConversationsDocument,
    "\n  query GetAllUsers {\n    getAllUsers {\n      id\n      username\n      email\n    }\n  }\n": types.GetAllUsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($updateProfileData: UpdateProfileInput!) {\n    updateProfile(updateProfileData: $updateProfileData) {\n      id\n      username\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($updateProfileData: UpdateProfileInput!) {\n    updateProfile(updateProfileData: $updateProfileData) {\n      id\n      username\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password)\n  }\n"): (typeof documents)["\n  mutation Login($email: String!, $password: String!) {\n    login(email: $email, password: $password)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Signup($username: String!, $email: String!, $password: String!) {\n    signup(username: $username, email: $email, password: $password)\n  }\n"): (typeof documents)["\n  mutation Signup($username: String!, $email: String!, $password: String!) {\n    signup(username: $username, email: $email, password: $password)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendMessage($content: String!, $conversationId: String!) {\n    sendMessage(content: $content, conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SendMessage($content: String!, $conversationId: String!) {\n    sendMessage(content: $content, conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateConversation($title: String!, $targetUserId: String!) {\n    createConversation(title: $title, targetUserId: $targetUserId) {\n      id\n      title\n      users {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateConversation($title: String!, $targetUserId: String!) {\n    createConversation(title: $title, targetUserId: $targetUserId) {\n      id\n      title\n      users {\n        id\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetConversationById($id: String!) {\n    getMyConversations {\n      id\n      title\n      users {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetConversationById($id: String!) {\n    getMyConversations {\n      id\n      title\n      users {\n        id\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMessagesByConversation($conversationId: String!) {\n    getMessagesByConversation(conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMessagesByConversation($conversationId: String!) {\n    getMessagesByConversation(conversationId: $conversationId) {\n      id\n      content\n      createdAt\n      user {\n        id\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      username\n      email\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      username\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyConversations {\n    getMyConversations {\n      id\n      title\n      createdAt\n      users {\n        id\n        username\n        email\n      }\n      messages {\n        id\n        content\n        createdAt\n        user {\n          id\n          username\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMyConversations {\n    getMyConversations {\n      id\n      title\n      createdAt\n      users {\n        id\n        username\n        email\n      }\n      messages {\n        id\n        content\n        createdAt\n        user {\n          id\n          username\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllUsers {\n    getAllUsers {\n      id\n      username\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetAllUsers {\n    getAllUsers {\n      id\n      username\n      email\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;