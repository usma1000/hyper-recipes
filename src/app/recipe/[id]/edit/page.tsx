import Editor from "./_components/editor";
import BackButton from "./_components/back-button";

export default function EditPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-8">Edit Recipe</h1>
        <BackButton />
      </div>
      <Editor />
    </div>
  );
}
