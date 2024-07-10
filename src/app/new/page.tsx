export default function Page() {
  return (
    <div>
      <h1>Create a new recipe</h1>
      <form className="flex flex-col">
        <label>
          Name
          <input type="text" />
        </label>
        <label>
          Description
          <textarea />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
