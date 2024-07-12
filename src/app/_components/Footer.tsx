export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white py-4 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex max-w-3xl items-center justify-between font-semibold">
        <div className="flex align-middle text-xl font-semibold">
          <span>Hyper Recipes</span>
        </div>
        <div className="flex items-center gap-4">
          <span>© {currentYear} Hyper Recipes</span>
        </div>
      </div>
    </footer>
  );
}
