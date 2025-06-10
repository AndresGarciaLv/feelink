export interface UserUpdateDto {
    id: string;
    name: string;
    firstLastName: string;
    secondLastName: string;
    email: string;
    password: string;
    emailConfirmed: boolean;
    companyId: string;
}