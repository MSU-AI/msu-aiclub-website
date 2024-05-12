/**
 * Redirects to user's dashboard based on type
 */
export const userTypeRedirect = (userType: string | null) => {
    if (userType === "guest") {
        return "/";
    } else if (userType === "member") {
        return "/member";
    } else if (userType === "admin") {
        return "/admin";
    } else {
        return "/";
    }
}