const renderNavItemTitle = (item, title) => {
  if (typeof title === 'string') {
    return title
  }

  return title(item)
}

export default renderNavItemTitle
