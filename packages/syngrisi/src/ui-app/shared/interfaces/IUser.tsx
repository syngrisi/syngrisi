/* eslint-disable semi */
export default interface IUser {
    id: string | undefined
    username: string | undefined
    firstName: string | undefined
    lastName: string | undefined
    role: string | undefined
    password: string | undefined
    apiKey: string | undefined
    updatedDate: string | undefined
    createdDate: string | undefined
    refetch?: any
}
