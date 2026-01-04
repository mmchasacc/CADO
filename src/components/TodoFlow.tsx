type View = "tasks" | "upcoming" | "all";

interface TodoFlowProps {
    setCreateOpen: (open: boolean) => void;
    setView: (view: View) => void;
    setActiveId: (id: number | null) => void;
    view: View;
    categories: string[];
}

const TodoFlow = ({ setCreateOpen, setView, setActiveId, view, categories }: TodoFlowProps) => {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-sm font-semibold">TodoFlow</h1>
                <button
                    onClick={() => setCreateOpen(true)}
                    className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs"
                >
                    + New
                </button>
            </div>

            <div className="space-y-1">
                {(["tasks", "upcoming", "all"] as View[]).map((v) => (
                    <button
                        key={v}
                        onClick={() => {
                            setView(v);
                            setActiveId(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${view === v ? "bg-indigo-500/15 text-indigo-200" : "text-white/70 hover:bg-white/5"
                            }`}
                    >
                        {v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                <p className="text-[11px] uppercase text-white/35 mb-2">Categories</p>
                <div className="space-y-1 max-h-[45vh] overflow-y-auto pr-1">
                    {categories.map((c) => (
                        <div key={c} className="px-3 py-2 rounded-lg text-xs text-white/60 bg-white/5 border border-white/5">
                            {c}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TodoFlow;