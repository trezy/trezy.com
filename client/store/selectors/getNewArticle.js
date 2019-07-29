const getCurrentUser = ({ currentUserID, users }) => {
  if (currentUserID) {
    return users[currentUserID]
  }

  return null
}





export default getCurrentUser
