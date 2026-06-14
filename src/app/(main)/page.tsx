import PostEditor from "@/features/posts/actions/PostEditor";
import PostCard from "@/features/posts/actions/PostCard";


export default function HomePage() {
  // Data dummy untuk simulasi feed
  const dummyPosts = [
    {
      id: 1,
      name: "Gemini Assistant",
      username: "gemini_ai",
      content:
        "Welcome to the new Finess feed! The UI is looking sharp with that dark theme and custom borders. 🚀 #web3 #design",
      time: "2h",
    },
    {
      id: 2,
      name: "Finess User",
      username: "finesser",
      content: "Just finished my onboarding. Loving the flow! 💎",
      time: "5h",
    },
  ];

  return (
    <div className="rounded-3xl">
      <PostEditor />

      <div className="flex flex-col mt-15">
        {dummyPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
