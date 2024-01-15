export interface IPasswordValidation {
    hasMinimumLength: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
    isValid: boolean;
}

export const Validators = {

    checkPassword: (password: string) => {
        const hasMinimumLength = password.length >= 7;
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[\@\#\$\%\^\&\*\!]/.test(password);
        return {
            hasMinimumLength,
            hasNumber,
            hasSymbol,
            isValid: hasMinimumLength && hasNumber && hasSymbol
        };
    },

    isValidPassword: (password: string) => {
        return Validators.checkPassword(password).isValid;
    }

};

