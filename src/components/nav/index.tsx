import NavRouter from "./router";


export default function Nav({
    userType
} : {
    userType: string
}) {
    return (
        <NavRouter userType={userType} />
    )
}