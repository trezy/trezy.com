export function updateStateObjectFromSnapshot(snapshot, keyToUpdate) {
	return previousValue => {
		const newValue = { ...previousValue }

		snapshot.docChanges().forEach(change => {
			const {
				doc,
				type,
			} = change
			const data = doc.data()
			let key = null


			if (keyToUpdate === 'id') {
				key = doc.id
			} else {
				key = data[keyToUpdate]
			}

			if (['added', 'modified'].includes(type)) {
				newValue[key] = data
			} else if (type === 'removed') {
				delete newValue[key]
			}
		})

		return newValue
	}
}
