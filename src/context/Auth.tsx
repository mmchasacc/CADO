export const isAuthenticated = () => {
    return !!localStorage.getItem("userId")
}

export const logout = () => {
    localStorage.removeItem("userId")
}