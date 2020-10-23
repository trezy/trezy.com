const actionTypes = [
	'FIND_MOVIES',
	'GET_MOVIES',
].reduce((acc, actionType) => ({
	...acc,
	[actionType]: actionType,
}), {})





export default actionTypes
