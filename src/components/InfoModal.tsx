interface InfoModalProps {
    name: string;
    setOpenInfo: (open: Boolean) => void;
}

const InfoModal = ({ name, setOpenInfo }: InfoModalProps) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-10 z-50" 
        onClick={() => setOpenInfo(false)}>
            <div className="flex flex-col justify-between bg-white p-4 rounded-lg shadow-lg h-[200px] w-1/4 z-60 cursor-default">
                <h3 className="flex text-lg font-semibold mb-2">예약 정보</h3>
                <div>
                    <p>예약자: {name}</p>
                    <button className="mt-4 w-full border-red-500 border-2 rounded-2xl h-10 text-sm hover:bg-red-500 transition-colors">
                        취소                    
                    </button>
                </div>    
            </div>
        </div>
    );
}

export default InfoModal;