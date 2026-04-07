export interface User {
    uid: string;
    email: string;
    name: string;
}

// left out passHash from your ERD here on purpose!
// Usually, we never want to pass a user's password hash to the frontend for security reasons.