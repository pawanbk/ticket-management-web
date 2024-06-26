export interface ITicket {
    _id: string,
    title: string,
    description: string,
    status: string,
    author: string,
    comments: [],
    createdAt: string,
    modifiedAt: string,
    updatedBy: string,
}



export interface InitialAuthState {
    isLoggedIn: boolean,
    user: IUser
}

export interface IUser {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string
}

export interface ILoginPayload {
    email: string,
    password: string
}

export interface ISignupPayload {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
}