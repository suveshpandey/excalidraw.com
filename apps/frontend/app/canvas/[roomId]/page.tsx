import { RoomCanvas } from "@/components/RoomCanvas";

interface PageProps {
    params: Promise< {roomId: string} >
}

// export default async function CanvasPage ( { params }: {
//     params: {
//         roomId: string
//     }
// }) {
//     const roomId = (await params).roomId;

//     return <RoomCanvas roomId={roomId} ></RoomCanvas>
// }

export default async function CanvasPage (props: PageProps) {
    const {roomId} = await props.params
    console.log("roomId", roomId);
    return <RoomCanvas roomId={roomId} ></RoomCanvas>
}