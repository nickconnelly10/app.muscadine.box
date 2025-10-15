

export default function Dashboard() {
    return (
        <div className="flex flex-col items-center bg-secondary justify-center h-[calc(100vh-var(--nav-bar-height))]">
            <div className="flex items-center justify-center w-full h-full m-10 px-10 gap-5">
                <div className="flex flex-col items-center justify-center w-3/4 h-full gap-5">
                    <div className="flex items-center justify-center border-2 rounded-3xl w-full h-1/4 border-red-500">
                        <h1 className="text-2xl font-bold">Account Stats and Info</h1>
                    </div>
                    <div className="flex items-center justify-center border-2 rounded-3xl w-full h-full border-blue-500">
                        <h1 className="text-2xl font-bold">Functionality</h1>
                    </div>
                </div>
                <div className="p-10 flex flex-col items-center justify-start border-2 rounded-3xl w-1/4 h-full border-green-500">
                        <h1 className="text-2xl font-bold">Vaults</h1>
                </div>
            </div>
        </div>
    )
}