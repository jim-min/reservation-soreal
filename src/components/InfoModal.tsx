import { supabase } from "../../utils/supabase";

interface InfoModalProps {
    reserver: {
        name: string,
        user_uid: string,
        day: string,
        time: number
    };
    setOpenInfo: (open: boolean) => void;
}

const InfoModal = ({ reserver, setOpenInfo }: InfoModalProps) => {
    const handleCancel = async (): Promise<void> => {
        const { error } = await supabase.from('reservation').delete().match({
            reserved_day: reserver.day,
            reserved_time: reserver.time,
            user_uid: reserver.user_uid //어차피 RLS가 막긴 하는데 그래도 2번 체크
        });
        if (error) {
            console.log('니가 예약한 거 아니잖아', error);
        }

        setOpenInfo(false);
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 z-50"
            onClick={(e) => e.target === e.currentTarget && setOpenInfo(false)}>
            <div className="flex flex-col justify-between bg-white p-4 rounded-lg shadow-lg h-[300px] w-1/2 md:w-1/3 lg:w-1/4 z-60 cursor-default">
                <div className="flex justify-between">
                    <h3 className="flex text-lg font-semibold mb-2">예약 정보</h3>
                    <span className="mr-1 cursor-pointer text-gray-400 hover:text-gray-600"
                        onClick={() => setOpenInfo(false)}
                    >
                        X
                    </span>
                </div>
                <div className="flex flex-col justify-center">
                    <p className="flex justify-center text-lg lg:text-2xl">예약자: {reserver.name}</p>
                    <button
                        className="mt-20 mx-auto w-2/3 border-red-500 border-2 rounded-2xl h-10 text-sm hover:bg-red-500 transition-color ease-in-out duration-300"
                        onClick={handleCancel}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InfoModal;