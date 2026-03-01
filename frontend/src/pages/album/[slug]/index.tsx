import { PageContainer } from "@/components/layouts/PageContainer";
import { Album } from "@/features/albums";
import { AlbumDetails } from "@/features/albums/components/AlbumDetails";
import { ApiResponse } from "@/lib/types";
import { GetServerSideProps } from "next";

type Props = {
    album: ApiResponse<Album> | null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { slug } = ctx.params as { slug: string };
    try {
        const res = await fetch(`http://localhost:4000/api/albums/${slug}`);
        const album = await res.json()
        return { props: { album } };
    } catch {
        return { props: { album: null } };
    }
};

export default function AlbumDetailsPage({ album }: Props) {
    if (!album) return <div>Album not found</div>;
    return (
        <PageContainer withFooter withSidebar withHeader>
            <AlbumDetails album={album.data} />
        </PageContainer>
    );
}