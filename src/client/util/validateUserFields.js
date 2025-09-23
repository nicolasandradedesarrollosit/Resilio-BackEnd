export async function validateFieldsRegister(name, province, city, phone_number, email, password) {
    const nameNormalized = String(name || "").trim();
    const provinceNormalized = String(province || "").trim();
    const cityNormalized = String(city || "").trim();
    const phoneNumberNormalized = String(phone_number || "").trim();
    const emailNormalized = String(email || "").toLowerCase().trim();
    const passwordNormalized = String(password || "").trim();

    if (!nameNormalized || !provinceNormalized || !cityNormalized || !phoneNumberNormalized || !emailNormalized || !passwordNormalized) {
        return false;
    }

    const nameRegex = /^[A-Za-zÀÁÉÍÓÚàáéíóúÑñ\s'-]{1,100}$/;
    const provinceRegex = /^[A-Za-zÀÁÉÍÓÚàáéíóúÑñ\s,'-]{1,100}$/;
    const cityRegex = /^[A-Za-zÀÁÉÍÓÚàáéíóúÑñ\s'-]{1,100}$/;
    const phoneRegex = /^[0-9]{9,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=\S{8,72}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/;

    if (!nameRegex.test(nameNormalized)) return false;
    if (!provinceRegex.test(provinceNormalized)) return false;
    if (!cityRegex.test(cityNormalized)) return false;
    if (!phoneRegex.test(phoneNumberNormalized)) return false;
    if (!emailRegex.test(emailNormalized)) return false;
    if (!passwordRegex.test(passwordNormalized)) return false;

    if (emailNormalized.length > 254) return false;

    return true;
}

export async function validateFieldsLogIn(email, password){
    const emailNormalized = String(email || "").trim();
    const passwordNormalized = String(password || "").trim();

    if(!emailNormalized || !passwordNormalized) return false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized) || emailNormalized.length > 254 || password.length > 72 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,72}$/.test(password)) return false;
    return true;
}