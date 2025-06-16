// auth.d.ts
declare module "#auth-utils" {
  interface User {
	name : string;
	email : string;
	createdAt : Date;
	role : 'ADMIN' | 'CLIENT'
  }
  
  interface UserSession {
	loggedInAt : Date;
  }
  
  interface SecureSessionData {
	// Add your own fields
  }
}

export {};
