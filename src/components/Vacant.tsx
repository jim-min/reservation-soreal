interface VacantProps {
    loggedIn: boolean;
    onReservation: () => void;
}

const Vacant = ({ loggedIn, onReservation }: VacantProps) => {
    if (loggedIn) {
        return (
            <button
                className="w-full h-10 pt-2 text-xs md:text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
                onClick={onReservation}
            >
                예약
            </button>
        );
    }

    return (
        <div className="flex p-1 h-10 pt-2 justify-center items-center text-sm text-gray-400 whitespace-nowrap">
            로그인
        </div>
    );
}

export default Vacant;