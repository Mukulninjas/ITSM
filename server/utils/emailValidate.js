const emailValidate = (email) => {
    let error;
    if (!email) {
        error = "*Field is required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        error = "*Email should contain @,.";
    } else if (![process.env.EMAIL_DOMAIN].includes(email.split("@")[1])) {
        error = "*Invalid email subdomain";
    } else if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]{2,3}$/.test(email)) {
        error = "*Invalid email format";
    }
    return error;
};

module.exports = { emailValidate };