import { graphql } from "../gql/gql"

export const GET_CONVERSATION_BY_ID = graphql(`
  query GetConversationById($id: String!) {
    getMyConversations {
      id
      title
      users {
        id
        username
      }
    }
  }
`)

export const GET_MESSAGES_BY_CONVERSATION = graphql(`
  query GetMessagesByConversation($conversationId: String!) {
    getMessagesByConversation(conversationId: $conversationId) {
      id
      content
      createdAt
      user {
        id
        username
      }
    }
  }
`)

export const ME = graphql(`
  query Me {
    me {
      id
      username
      email
    }
  }
`)

export const GET_MY_CONVERSATIONS = graphql(`
  query GetMyConversations {
    getMyConversations {
      id
      title
      createdAt
      users {
        id
        username
        email
      }
    }
  }
`)

export const GET_ALL_USERS = graphql(`
  query GetAllUsers {
    getAllUsers {
      id
      username
      email
    }
  }
`)
