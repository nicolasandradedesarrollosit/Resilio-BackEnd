export async function validateFieldsRegister(name, email, phone_number, password){
    const nameNormalized = String(name || "").trim();
    const emailNormalized = String(email || "").trim();
    const phoneNumberNormalized = String(phone_number || "").trim();
    const passwordNormalized = String(password || "").trim();

    if(nameNormalized.length > 100 || nameNormalized.length < 2) return false;

    if(!nameNormalized || !emailNormalized || !phoneNumberNormalized || !passwordNormalized) return false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized) || emailNormalized.length > 254 || !/^\d{7,15}$/.test(phoneNumberNormalized) || passwordNormalized.length > 72 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,72}$/.test(String(password))) return false;

    return true;
}

export async function validateFieldsLogIn(email, password){
    const emailNormalized = String(email || "").trim();
    const passwordNormalized = String(password || "").trim();

    if(!emailNormalized || !passwordNormalized) return false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized) || emailNormalized.length > 254 || password.length > 72 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,72}$/.test(password)) return false;
    return true;
}