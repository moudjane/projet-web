import { graphql } from "../gql/gql";

export const SEND_MESSAGE = graphql(`
  mutation SendMessage($content: String!, $conversationId: String!) {
    sendMessage(content: $content, conversationId: $conversationId) {
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

export const CREATE_CONVERSATION = graphql(`
  mutation CreateConversation($title: String!, $targetUserId: String!) {
    createConversation(title: $title, targetUserId: $targetUserId) {
      id
      title
      users {
        id
        username
      }
    }
  }
`)

export const UPDATE_PROFILE = graphql(`
  mutation UpdateProfile($updateProfileData: UpdateProfileInput!) {
    updateProfile(updateProfileData: $updateProfileData) {
      id
      username
      email
    }
  }
`)

export const LOGIN = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`)

export const SIGNUP = graphql(`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password)
  }
`)
