import NavRouter from "./router";


export default function Nav({
    userType
} : {
    userType: string | null
}) {
    return (
        <NavRouter userType={userType} />
    )
}