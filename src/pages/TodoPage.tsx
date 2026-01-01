import { useMemo, useState } from "react";
import CalendarComponent from "../components/Calendar";

/* ───────────── TYPES ───────────── */
type Task = {
  id: number;
  title: string;
  description?: string;
  category: string;
  date: Date;
  done: boolean;
};

/* ───────────── PAGE ───────────── */
const TodoPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<"today" | "upcoming" | "all">("today");

  /* New task state */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  /* ───────────── LOGIC ───────────── */

  const addTask = () => {
    if (!title.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        description,
        category,
        date: selectedDate,
        done: false,
      },
    ]);

    setTitle("");
    setDescription("");
    setCategory("Personal");
    setSelectedDate(new Date());
    setIsModalOpen(false);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const today = new Date().toDateString();

  const filteredTasks = useMemo(() => {
    if (view === "all") return tasks;

    if (view === "today") {
      return tasks.filter(
        (t) => t.date.toDateString() === today
      );
    }

    // upcoming
    return tasks.filter(
      (t) => t.date.toDateString() !== today
    );
  }, [tasks, view, today]);

  /* ───────────── UI ───────────── */

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0B0F1A] text-white">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-56 flex-col bg-[#0E1324] border-r border-white/10 px-5 py-6">
        <h1 className="text-lg font-semibold mb-6">TodoFlow</h1>

        <SidebarItem
          label="Today"
          active={view === "today"}
          onClick={() => setView("today")}
        />
        <SidebarItem
          label="Upcoming"
          active={view === "upcoming"}
          onClick={() => setView("upcoming")}
        />
        <SidebarItem
          label="All Tasks"
          active={view === "all"}
          onClick={() => setView("all")}
        />
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1400px] flex flex-col md:flex-row gap-6 p-4 md:p-6">
          {/* TASK LIST */}
          <section className="flex-1 flex flex-col bg-[#0E1324] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between">
              <div>
                <h2 className="text-2xl font-semibold capitalize">
                  {view}
                </h2>
                <p className="text-sm text-white/40">
                  {filteredTasks.length} tasks
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-medium"
              >
                + New Task
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {filteredTasks.length === 0 && (
                <p className="text-white/40 text-sm">
                  No tasks here. Good or dangerous — depends on you.
                </p>
              )}

              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </section>

          {/* RIGHT PANEL */}
          <aside className="hidden md:flex w-80 bg-[#0E1324] border border-white/10 rounded-2xl p-5 flex-col">
            <h3 className="font-medium mb-4">Calendar</h3>
            <CalendarComponent
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </aside>
        </div>
      </main>

      {/* MOBILE ADD BUTTON */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-500 text-2xl flex items-center justify-center"
      >
        +
      </button>

      {/* ADD TASK MODAL / SHEET */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
          <div className="w-full md:w-[420px] bg-[#0E1324] rounded-t-2xl md:rounded-2xl p-5 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">
              New Task
            </h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full mb-3 px-3 py-2 rounded-lg bg-black/30 border border-white/10"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full mb-3 px-3 py-2 rounded-lg bg-black/30 border border-white/10 resize-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-black/30 border border-white/10"
            >
              <option>Personal</option>
              <option>Work</option>
              <option>School</option>
              <option>Shopping</option>
            </select>

            <CalendarComponent
              value={selectedDate}
              onChange={setSelectedDate}
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 rounded-lg border border-white/20 text-white/60"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;

/* ───────────── COMPONENTS ───────────── */

const SidebarItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm text-left ${active
      ? "bg-indigo-500/20 text-indigo-300"
      : "text-white/70 hover:bg-white/5"
      }`}
  >
    {label}
  </button>
);

const TaskItem = ({ task, onToggle, onDelete }: any) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
    <button
      onClick={() => onToggle(task.id)}
      className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center text-xs ${task.done
        ? "border-indigo-400 text-indigo-400"
        : "border-white/30"
        }`}
    >
      {task.done && "✓"}
    </button>

    <div className="flex-1">
      <p
        className={`text-sm font-medium ${task.done && "line-through text-white/40"
          }`}
      >
        {task.title}
      </p>
      {task.description && (
        <p className="text-xs text-white/40">
          {task.description}
        </p>
      )}
      <p className="text-xs text-white/30 mt-1">
        {task.category} ·{" "}
        {task.date.toLocaleDateString()}
      </p>
    </div>

    <button
      onClick={() => onDelete(task.id)}
      className="text-white/40 hover:text-red-400 text-sm"
    >
      ✕
    </button>
  </div>
);
