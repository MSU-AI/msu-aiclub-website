import { Button, Card, CardFooter, CardHeader, Chip } from "@nextui-org/react";
import { Image } from "@nextui-org/react";


export const ProfileCard = ({ 
    profile 
} : {
    profile: any
}) => (
    <Card isFooterBlurred className="min-h-[300px] space-y-4 flex flex-col">
        <div className="relative flex-grow">
            <Image
                removeWrapper
                alt="Card background"
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={profile?.avatar}
            />
        </div>
        <CardFooter className="flex flex-col items-center justify-center z-10 h-[25%]">
            <p>{profile?.name}</p>
            <p>{profile?.email}</p>
        </CardFooter>
    </Card>
);