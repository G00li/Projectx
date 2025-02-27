// // services/postService.ts (Frontend)
// import { PostData } from "@/types/Post";

// // Função para criar um post (apenas interagir com a API)
// export async function createPost(data: PostData) {
//   try {
//     const response = await fetch("/api/create-post", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error("Erro ao criar o post");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Erro ao criar o post:", error);
//     throw error;
//   }
// }
