export interface User {
    id: number;
    password: string;
    name: string;
    token: string;
    role: string;
    info;
}

export class User implements User {
    constructor() {
        return {
            id: null,
            password: '',
            name: '',
            token: '',
            role: '',
            info: ''
        }
    }
}
