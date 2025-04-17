export const initialFormState = {
    email: '',
    password: '',
    username: '',
    displayName: '',
    confirmPassword: ''
};

export const initialErrorState = {
    ...initialFormState,
    form: ''
};

export const initialTouchedState = {
    email: false,
    password: false,
    username: false,
    displayName: false,
    confirmPassword: false
};