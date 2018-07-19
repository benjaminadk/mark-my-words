import gql from 'graphql-tag'

export const MARK_AS_SEEN_MUTATION = gql`
  mutation($notificationId: ID) {
    markAsSeen(notificationId: $notificationId) {
      success
      message
    }
  }
`
