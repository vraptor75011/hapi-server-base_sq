module.exports = {
	// Common attributes and relations
	common: {
		// Common
		id: "id",
		createdAt: "creato alle",
		deletedAt: "cancellato alle",
		updatedAt: "aggiornato alle",
	},

	association: {
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
	attempt: {
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
		name: "Nome",
		description: "Descrizione",
        newRole: 'Nuovo Ruolo',
        editRole: 'Modifica Ruolo',
        deleteRole: 'Cancella Ruolo',
        deleteRoleWarning: "Sei sucuro di voler cancellare questo ruolo?",
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
		activateAccountExpires: "Scadenza attivazione account",
		activateAccountToken: "Token attivazione account",
		currentLoginAt: "Accesso corrente",
		currentLoginIP: "Attuale ip",
		email: "Email",
		firstName: "Nome",
		ip: "Ip",
		isActive: "Attivo",
		lastLoginAt: "Ultimo accesso",
		lastLoginIP: "Ultimo accesso ip",
		lastName: "Cognome",
		password: "Password",
		resetPasswordExpires: "Scadenza reset password",
		resetPasswordNewPWD: "Nuova password reset password",
		resetPasswordToken: "Token reset password",
		username: "Nome utente",
		newUser: 'Nuovo Utente',
        editUser: 'Modifica Utente',
        deleteUser: 'Cancella Utente',
		deleteUserWarning: "Sei sucuro di voler cancellare questo utente?",

		// Virtual Attributes
		fullName: "Nome completo",
		confirmPassword: "Conferma password",
		confirmEmail: "Conferma email",
	},
};
