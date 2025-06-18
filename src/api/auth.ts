let API_URL = 'http://localhost:5249/api/security';

export interface RegisterUserDto {
    accountType: "student" | "teacher";
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    surname: string;
    telephone: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export let registerUser = async (userData: RegisterUserDto): Promise<void> => {
    let res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok){
        let errors = await res.json();
        throw new Error(errors.join(", "));
    }
}

export let loginUser = async (userData: LoginUserDto): Promise<AuthResponse> => {
    let res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!res.ok){
        let errors = await res.json();
        throw new Error(errors.join(", "));
    }

    return await res.json();
}

export let refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
    let res = await fetch(`${API_URL}/refresh?refreshToken=${refreshToken}`, {
        method: 'POST',
    });

    if(!res.ok){
        let errors = await res.json();
        throw new Error(errors.join(", "));
    }

    return await res.json();
}