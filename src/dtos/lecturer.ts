export default interface Passwords {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }
  
  export interface ChangePassword {
    [x: string]: any;
    userId: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }
  
  export interface ProfileData {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  }

  export interface AddUser {
    [x: string]: any;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isLecturer: boolean
  }
  