import { useEffect, useState } from "react";

const GITHUB_USER = "JayMiller08";

export interface GitHubStats {
  publicRepos: number;
  memberSince: number;
  topLanguage: string;
}

interface GitHubRepo {
  language: string | null;
}

/**
 * Live GitHub figures for the stats row.
 *
 * The initial state mirrors the account at the time of writing so the row never
 * renders empty, and every value is overwritten by the fetch on mount — nothing
 * displayed here is a hardcoded claim once the request lands.
 */
export const useGitHubStats = () => {
  const [stats, setStats] = useState<GitHubStats>({
    publicRepos: 27,
    memberSince: 2024,
    topLanguage: "TypeScript",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchGitHubStats = async () => {
      try {
        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`),
        ]);
        const userData = await userResponse.json();
        const reposData: GitHubRepo[] = await reposResponse.json();

        const languageCounts: Record<string, number> = {};
        if (Array.isArray(reposData)) {
          reposData.forEach((repo) => {
            if (repo.language) {
              languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
          });
        }

        const topLanguage =
          Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "TypeScript";

        if (cancelled) return;
        setStats({
          publicRepos: userData.public_repos ?? 0,
          memberSince: userData.created_at
            ? new Date(userData.created_at).getFullYear()
            : 2024,
          topLanguage,
        });
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(fetchGitHubStats, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { stats, loading };
};
