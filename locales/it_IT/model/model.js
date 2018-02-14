module.exports = {
	// Common attributes and relations
	common: {
		// Common
		id: "id",
		createdAt: "creato alle",
		deletedAt: "cancellato alle",
		updatedAt: "aggiornato alle",
	},

	relation: {
		// Relations
		realmId: "reame id",
		realm: "reame",
		realms: "reami",
		roleId: "ruolo id",
		role: "ruolo",
		roles: "ruoli",
		sessionId: "sessione id",
		session: "sessione",
		sessions: "sessioni",
		userId: "utente id",
		user: "utente",
		users: "utenti",
	},

	// AuthAttempt
	authAttempt: {
		count: "conteggio",
		ip: "ip",
		email: "email",
		username: "nome utente"
	},

	// Realm
	realm: {
		name: "nome",
		description: "descrizione",
	},

	// Role
	role: {
		name: "nome",
		description: "descrizione",
	},

	// Session
	session: {
		// Attributes
		key: "chiave",
		passwordHash: "password hash",
		userAgent: "user agent",
	},

	// User
	user: {
		activateAccountExpires: "scadenza attivazione account",
		activateAccountToken: "token attivazione account",
		currentLoginAt: "attuale login alle",
		currentLoginIP: "attuale login ip",
		email: "email",
		firstName: "nome",
		ip: "ip",
		isActive: "attivo",
		lastLoginAt: "ultimo login alle",
		lastLoginIP: "ultimo login ip",
		lastName: "cognome",
		password: "password",
		resetPasswordExpires: "scadenza reset password",
		resetPasswordNewPWD: "nuova password reset password",
		resetPasswordToken: "token reset password",
		username: "nome utente",

		// Virtual Attributes
		fullName: "nome completo",
		confirmPassword: "conferma password",
		confirmEmail: "conferma email",
	},
};