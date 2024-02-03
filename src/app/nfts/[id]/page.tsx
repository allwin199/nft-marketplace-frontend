import FetchNft from "@/components/FetchNft/FetchNft";

type Props = {
    params: { id: string };
};

const page = (params: Props) => {
    return (
        <main className="container mx-auto pt-28">
            <FetchNft id={params.params.id} />
        </main>
    );
};

export default page;
