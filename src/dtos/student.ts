export default interface Passwords {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
}

export interface ChangePassword {
    [x: string]: any,
    userId: string,
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }

