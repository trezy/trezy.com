const connections = {}
const disconnectTimers = {}





export default class ConnectionManager {
	add = connection => {
		if (disconnectTimers[connection.name]) {
			clearTimeout(disconnectTimers[connection.name])
		}

		connections[connection.name] = connection
	}

	find = name => connections[name]

	remove = name => {
		if (disconnectTimers[name]) {
			clearTimeout(disconnectTimers[name])
		}

		disconnectTimers[name] = setTimeout(() => {
			connections[name].unsubscribe()
			delete connections[name]
		}, 1000)
	}
}
