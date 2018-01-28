const JWTDecode = require ('jwt-decode');


const standardTokenName = "standardToken";
const refreshTokenName = 'refreshToken';
const profileName = 'profile';


// Utility Token library
export function getToken() {
	const StandardToken = localStorage.getItem(standardTokenName) !== 'undefined' || null ? localStorage.getItem(standardTokenName) : null;
	if (StandardToken) {
		const decodedToken = JWTDecode(StandardToken);
		console.log('il store esiste');
		if (isTokenExpired(decodedToken)) {
			///se il store è scaduto....
			const RefreshToken = localStorage.getItem(refreshTokenName) !== 'undefined' || null ? localStorage.getItem(refreshTokenName) : null;
			console.log('lo standardToken è scaduto');

			if (RefreshToken) {
				console.log('il refresh store esiste');
				const decodedRefreshToken = JWTDecode(RefreshToken);
				if (isTokenExpired(decodedRefreshToken)) {
					return null
				} else {
					return RefreshToken
				}
			}
		} else {
			return StandardToken
		}

	} else {
		return null
	}
}

export function setToken(standardToken, refreshToken) {
	if (standardToken && refreshToken) {
		localStorage.setItem(standardTokenName, standardToken);
		localStorage.setItem(refreshTokenName, refreshToken);
	}
}

export function getProfile() {
	return localStorage.getItem(profileName) !== 'undefined' || null ? localStorage.getItem(profileName) : null;
}

export function setProfile(profile) {
	if (profile) {
		localStorage.setItem(profileName, profile);
	}
}


function isTokenExpired(token) {
	if(token) {
		return token.exp < Date.now() / 1000
	}
	return true
}
