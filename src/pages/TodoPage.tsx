import { useEffect, useMemo, useState } from "react";
import CalendarComponent from "../components/Calendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Status = "Urgent" | "Serious" | "Get it done";
type View = "today" | "upcoming" | "all";

type Task = {
  id: number;
  title: string;
  notes: string;
  category: string;
  status: Status;
  date: Date;
  done: boolean;
};

const STATUSES: Status[] = ["Urgent", "Serious", "Get it done"];
const DEFAULT_CATEGORIES = ["Personal", "Work", "School"];

const TodoPage = () => {
  const navigate = useNavigate()


  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  const [view, setView] = useState<View>("today");

  const [tasks, setTasks] = useState<Task[]>([]);

  const [customCategories, setCustomCategories] = useState<string[]>([])

  const [createOpen, setCreateOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  const [tTitle, setTTitle] = useState("");
  const [tNotes, setTNotes] = useState("");
  const [tStatus, setTStatus] = useState<Status>("Get it done");
  const [tCategory, setTCategory] = useState("Personal");
  const [tDate, setTDate] = useState<Date>(new Date());
  const [newCat, setNewCat] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("userId")
    navigate("/login")
  }


  useEffect(() => {
    if (!userId) return;

    const config = { headers: { "user-id": userId } }

    axios.get("http://localhost:5000/api/tasks", config)
      .then((res) => {

        const loadedTasks = res.data.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          done: Boolean(t.done)
        }));
        setTasks(loadedTasks);
      })
      .catch((err) => {
        console.error("Error fetching tasks", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
        }
      });
  }, [userId]);



  const todayKey = new Date().toDateString();
  const todayEnd = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }, []);

  const filtered = useMemo(() => {
    if (view === "all") return tasks;
    if (view === "today") return tasks.filter((t) => t.date.toDateString() === todayKey);
    return tasks.filter((t) => t.date.getTime() > todayEnd);
  }, [tasks, view, todayKey, todayEnd]);

  const active = useMemo(() => tasks.find((t) => t.id === activeId) ?? null, [tasks, activeId]);


  const categories = useMemo(() => {
    const taskCats = tasks.map(t => t.category)
    return Array.from(new Set([...DEFAULT_CATEGORIES,  ...customCategories,...taskCats]))
  }, [tasks, customCategories])


      const addCategory = (e: React.MouseEvent) => {
      e.preventDefault()
      const name = newCat.trim();
      if (!name) return;
      setCustomCategories((prev) => [...prev, name])

      setTCategory(name);
      setNewCat("");
    }


    const actionHeader = { headers: { "user-id": userId } }

  const addTask = async () => {
    if (!tTitle.trim()) return;

    const newTaskPayload: Task = {
      id: Date.now(),
      title: tTitle.trim(),
      notes: tNotes.trim(),
      category: tCategory,
      status: tStatus,
      date: tDate,
      done: false,
    };
    
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", newTaskPayload, actionHeader)

      const task: Task = { ...newTaskPayload, id: res.data.id }
      setTasks((p) => [...p, task]);

      setTTitle("");
      setTNotes("");
      setTStatus("Get it done");
      setTCategory("Personal");
      setTDate(new Date());
      setCreateOpen(false);
    } catch (err) {
      console.error("Error adding task", err)
    }
  };

  const updateTask = async (id: number, patch: Partial<Task>) => {
    const oldTasks = [...tasks]


    setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, patch, actionHeader);
    } catch (err) {
      console.error("Error updating task", err);
      setTasks(oldTasks);
    }
  }




  const removeTask = async (id: number) => {
    const oldTasks = [...tasks]


    setTasks((p) => p.filter((t) => t.id !== id));
    if (activeId === id) setActiveId(null);

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, actionHeader)
    } catch (err) {
      console.error("Failed to delete", err)
      setTasks(oldTasks)
    }
  };




  const statusClass = (s: Status) =>
    s === "Urgent"
      ? "bg-red-500/15 text-red-200 border-red-400/20"
      : s === "Serious"
        ? "bg-amber-500/15 text-amber-200 border-amber-400/20"
        : "bg-emerald-500/15 text-emerald-200 border-emerald-400/20";






  return (

    <div className=" overflow-hidden bg-[#0B0F1A] text-white">
      <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-indigo-200 hover:bg-indigo-300 active:bg-indigo-400 text-xs font-bold text-gray-600">LOGOUT</button>
      <div className="h-full w-full flex overflow-hidden">
        {/* sidebar desktop */}
        <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[#0E1324] border-r border-white/10 p-4">
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
            {(["today", "upcoming", "all"] as View[]).map((v) => (
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
                <div key={c} className="px-3 py-2 rounded-lg text-xs text-white/60 bg-white/5">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* main */}
        <main className="flex-1 overflow-hidden flex justify-center">
          <div className="w-full flex  md:flex-row gap-3 p-3 md:p-4">
            {/* list */}
            <section className="flex-1 min-h-0 flex flex-col rounded-2xl border border-white/10 bg-[#0E1324] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold capitalize">{view}</h2>
                  <p className="text-xs text-white/40">
                    {filtered.filter((t) => t.done).length}/{filtered.length} done
                  </p>
                </div>
                <button
                  onClick={() => setCreateOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-xs font-medium"
                >
                  + New Task
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
                {filtered.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className={`rounded-2xl border p-3 cursor-pointer ${activeId === t.id
                      ? "border-indigo-400/40 bg-indigo-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/7"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTask(t.id, { done: !t.done });
                        }}
                        className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-[11px]
                          ${t.done ? "border-indigo-400 text-indigo-300" : "border-white/25 text-white/40"}
                        `}
                      >
                        {t.done ? "✓" : ""}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold ${t.done ? "line-through text-white/35" : "text-white/90"}`}>
                            {t.title}
                          </p>
                          <span className={`text-[11px] px-2 py-1 rounded-full border ${statusClass(t.status)}`}>
                            {t.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                          <span className="px-2 py-0.5 rounded-md bg-black/20 border border-white/10">{t.category}</span>
                          <span>•</span>
                          <span>{t.date.toLocaleDateString()}</span>
                        </div>
                        {t.notes && <p className="text-xs text-white/45 mt-2 line-clamp-2">{t.notes}</p>}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTask(t.id);
                        }}
                        className="text-white/30 hover:text-red-300 text-sm px-2"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    No tasks here.
                  </div>
                )}
              </div>
            </section>

            {/* details desktop */}
            <aside className="hidden md:flex w-[360px] min-h-0 flex-col rounded-2xl border border-white/10 bg-[#0E1324] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <p className="text-sm font-semibold">{active ? "Task details" : "Schedule"}</p>
                {active && (
                  <button onClick={() => setActiveId(null)} className="text-xs text-white/50 hover:text-white/80">
                    Close
                  </button>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                {!active ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-white/45 mb-2">Pick date (used in New Task)</p>
                    <CalendarComponent value={tDate} onChange={setTDate} />
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-white/45 mb-2">Title</p>
                      <input
                        value={active.title}
                        onChange={(e) => updateTask(active.id, { title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm"
                      />
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs text-white/45 mb-2">Notes</p>
                      <textarea
                        value={active.notes}
                        onChange={(e) => updateTask(active.id, { notes: e.target.value })}
                        className="w-full h-28 px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs text-white/45 mb-2">Status</p>
                        <select
                          value={active.status}
                          onChange={(e) => updateTask(active.id, { status: e.target.value as Status })}
                          className="w-full px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s} className="text-black">
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs text-white/45 mb-2">Category</p>
                        <select
                          value={active.category}
                          onChange={(e) => updateTask(active.id, { category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c} className="text-black">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 overflow-visible">
                      <p className="text-xs text-white/45 mb-2">Due date</p>
                      <CalendarComponent
                        value={active.date}
                        onChange={(d: Date) => updateTask(active.id, { date: d })}
                      />
                    </div>

                    <button
                      onClick={() => removeTask(active.id)}
                      className="py-2 rounded-lg bg-red-500/15 hover:bg-red-500/20 border border-red-400/20 text-red-200 text-sm"
                    >
                      Delete task
                    </button>
                  </>
                )}
              </div>
            </aside>
          </div>
        </main>

        {/* mobile FAB */}
        <button
          onClick={() => setCreateOpen(true)}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-400 text-2xl flex items-center justify-center shadow-xl"
        >
          +
        </button>

        {/* CREATE MODAL/SHEET (FIXED HEIGHT + SCROLL so calendar is clickable) */}
        {createOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/55 flex items-end md:items-center justify-center p-3"
            onMouseDown={() => setCreateOpen(false)}
          >
            <div className="w-full flex justify-center" onMouseDown={(e) => e.stopPropagation()}>
              <div className="w-full mb-60 md:w-130 max-h-[90vh] max-w-250 overflow-y-auto overscroll-contain bg-[#0E1324] border border-white/10 rounded-t-2xl md:rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">New task</p>
                  <button onClick={() => setCreateOpen(false)} className="text-xs text-white/50 hover:text-white/80">
                    Close
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    value={tTitle}
                    onChange={(e) => setTTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm"
                  />
                  <textarea
                    value={tNotes}
                    onChange={(e) => setTNotes(e.target.value)}
                    placeholder="Notes"
                    className="w-full h-24 px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm resize-none"
                  />

                  <div className="flex gap-2">
                    <select
                      value={tStatus}
                      onChange={(e) => setTStatus(e.target.value as Status)}
                      className="flex-1 px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="text-black">
                          {s}
                        </option>
                      ))}
                    </select>

                    <select
                      value={tCategory}
                      onChange={(e) => setTCategory(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="text-black">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                      placeholder="Create category (optional)"
                      className="flex-1 px-3 py-2 rounded-lg bg-black/25 border border-white/10 text-sm"
                    />
                    <button onClick={addCategory} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">
                      Add
                    </button>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 overflow-visible">
                    <p className="text-xs text-white/45 mb-2">Due date</p>
                    <CalendarComponent value={tDate} onChange={setTDate} />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setCreateOpen(false)}
                      className="flex-1 py-2 rounded-lg border border-white/15 text-white/60 hover:bg-white/5 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addTask}
                      className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;
