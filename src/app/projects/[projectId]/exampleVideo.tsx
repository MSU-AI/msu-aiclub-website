
export async function ExampleVideo({
    videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
} : {
    videoUrl: string
}) {
    return (
<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=0_2S7kjwV1fzgbOT" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    )
}