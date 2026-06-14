"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Database } from "../types/database.types";

type User = Database["public"]["Tables"]["users"]["Row"];
type Post = Database["public"]["Tables"]["posts"]["Row"];

export function useUser(userId: string | undefined) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, isLoading, error };
}

export function usePosts(limit = 20) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  return { posts, isLoading, error };
}

export function useUserPosts(userId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  return { posts, isLoading, error };
}

export function useLikePost() {
  const likePost = useCallback(async (postId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);

        if (error) throw error;
        return { success: true, liked: false };
      } else {
        // Like
        const { error } = await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: userId,
        });

        if (error) throw error;
        return { success: true, liked: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to toggle like",
      };
    }
  }, []);

  return { likePost };
}

export function useFollowUser() {
  const followUser = useCallback(
    async (followerId: string, followingId: string) => {
      try {
        // Check if already following
        const { data: existingFollow } = await supabase
          .from("followers")
          .select("id")
          .eq("follower_id", followerId)
          .eq("following_id", followingId)
          .single();

        if (existingFollow) {
          // Unfollow
          const { error } = await supabase
            .from("followers")
            .delete()
            .eq("follower_id", followerId)
            .eq("following_id", followingId);

          if (error) throw error;
          return { success: true, following: false };
        } else {
          // Follow
          const { error } = await supabase.from("followers").insert({
            follower_id: followerId,
            following_id: followingId,
          });

          if (error) throw error;
          return { success: true, following: true };
        }
      } catch (err) {
        return {
          success: false,
          error:
            err instanceof Error ? err.message : "Failed to toggle follow",
        };
      }
    },
    []
  );

  return { followUser };
}
